<template>
  <!-- 路由出口 -->
  <router-view v-slot="{ Component }">
    <!-- 动画组件 -->
    <transition 
    :name="transitionName"
      @before-enter="beforeEnter"
      @after-leave="afterLeave">
      <!-- 缓存组件 -->
      <keep-alive :include="virtualTaskStack">
        <component 
        :is="Component"
        :class="{ 'fixed top-0 left-0 w-screen z-50': isAnimation }" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script>
const NONE = 'none'
const ROUTER_TYPE_PUSH= 'push'
const ROUTER_TYPE_BACK= 'back'
const ROUTER_TYPE_ENUM = [NONE,ROUTER_TYPE_PUSH,ROUTER_TYPE_BACK]
</script>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const props = defineProps({
  // 路由跳转的类型，对应 ROUTER_TYPE_ENUM
  routerType: {
    type: String,
    default: NONE,
    validator(val) {
      const result = ROUTER_TYPE_ENUM.includes(val)
      if (!result) {
        throw new Error(
          `你的 routerType 必须是 ${ROUTER_TYPE_ENUM.join('、')} 中的一个`
        )
      }
      return result
    }
  },
  // 首页的组件名称，对应任务栈中的第一个组件
  mainComponentName: {
    type: String,
    required: true
  }
})

const router = useRouter()
const store = useStore()
// 跳转动画名称（使用 computed 从 props 获取，props 由 store getter 驱动，在 router beforeEach 中已更新）
const transitionName = computed(() => props.routerType)
/**
 * 清空栈
 */
const clearTask = () => {
  virtualTaskStack.value = [props.mainComponentName]
}
// router的前置守卫：维护 keep-alive 任务栈
// 注意：此处不能读 props.routerType（父组件尚未重渲染，prop 是旧值），需直接从 store 读取
const removeBeforeEach = router.beforeEach((to, from) => {
  const routerType = store.state.app.routerType
  if (routerType === ROUTER_TYPE_PUSH) {
    // 入栈
    virtualTaskStack.value.push(to.name)
  } else if (routerType === ROUTER_TYPE_BACK && virtualTaskStack.value.length > 1) {
    // 出栈（至少保留一个，防止 keep-alive include 为空导致所有缓存失效）
    virtualTaskStack.value.pop()
  }
  // 进入首页默认清空栈
  if (to.name === props.mainComponentName) {
    clearTask()
  }
})
// 组件卸载时移除守卫，避免 HMR 时重复注册
onUnmounted(() => {
  removeBeforeEach()
})
// 处理动画状态变化
const isAnimation = ref(false)
const beforeEnter = () => {
  isAnimation.value = true
}
const afterLeave = () => {
  isAnimation.value = false
}
// 任务栈
const virtualTaskStack = ref([props.mainComponentName])
</script>

<style lang="scss" scoped>
// push页面时：新页面的进入动画
.push-enter-active {
  animation-name: push-in;
  animation-duration: 0.4s;
}
// push页面时：老页面的退出动画
.push-leave-active {
  animation-name: push-out;
  animation-duration: 0.4s;
  z-index: 60;
}
// push页面时：新页面的进入动画
@keyframes push-in {
  0% {
    transform: translate(100%, 0);
  }
  100% {
    transform: translate(0, 0);
  }
}
// push页面时：老页面的退出动画
@keyframes push-out {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(-100%, 0);
  }
}

// 后退页面时：即将展示的页面动画
.back-enter-active {
  animation-name: back-in;
  animation-duration: 0.4s;
}
// 后退页面时：后退的页面执行的动画
.back-leave-active {
  animation-name: back-out;
  animation-duration: 0.4s;
  z-index: 60;
}
// 后退页面时：即将展示的页面动画
@keyframes back-in {
  0% {
    width: 100%;
    transform: translate(-100%, 0);
  }
  100% {
    width: 100%;
    transform: translate(0, 0);
  }
}
// 后退页面时：后退的页面执行的动画
@keyframes back-out {
  0% {
    width: 100%;
    transform: translate(0, 0);
  }
  100% {
    width: 100%;
    transform: translate(100%, 0);
  }
}
</style>
