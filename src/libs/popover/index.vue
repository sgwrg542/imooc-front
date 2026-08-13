<template>
  <div class="relative" @mouseleave="onMouseleave" @mouseenter="onMouseenter">
    <div ref="referenceTarget">
      <!-- 具名插槽 -->
      <slot name="reference" />
    </div>
    <!-- 气泡展示动画 -->
    <transition name="slide">
      <div
      ref="contentTarget"
        v-show="isVisable"
        :style="contentStyle"
        class="absolute p-1 z-20 bg-white border rounded-md dark:border-zinc-600 dark:bg-zinc-900"
      >
        <!-- 匿名插槽 -->
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
// 延迟关闭时长
const DELAY_TIME = 100

// 引用元素（模板中 ref="referenceTarget" / ref="contentTarget" 需在此声明）
const referenceTarget = ref(null)
const contentTarget = ref(null)

// 顶层调用 useElementSize，返回响应式尺寸（内部用 ResizeObserver 异步更新）
const { width: referenceWidth, height: referenceHeight } = useElementSize(referenceTarget)
const { width: contentWidth, height: contentHeight } = useElementSize(contentTarget)

const props = defineProps({
  // 控制气泡弹出位置，并给出开发者错误的提示
  placement: {
    type: String,
    default: 'bottom-left',
    validator(val) {
      const result = placementEnum.includes(val)
      if (!result) {
        throw new Error(
          `你的 placement 必须是 ${placementEnum.join('、')} 中的一个`
        )
      }
      return result
    }
  }
})
/**
 * 计算弹层位置
 */
const contentStyle = ref({
  top: 0,
  left: 0
})


// 控制 menu 展示
const isVisable = ref(false)
// 控制延迟关闭
let timeout = null
/**
 * 鼠标移入的触发行为
 */
const onMouseenter = () => {
  isVisable.value = true
  // 再次触发时，清理延时装置
  if (timeout) {
    clearTimeout(timeout)
  }
}
/**
 * 鼠标移出的触发行为
 */
const onMouseleave = () => {
  // 延时装置
  timeout = setTimeout(() => {
    isVisable.value = false
    timeout = null
  }, DELAY_TIME)
}

/**
 * 监听展示状态与尺寸变化，在展示时计算气泡位置
 * 气泡用 v-show 控制，显示后 contentWidth 由 ResizeObserver 异步更新，
 * 因此同时监听尺寸，确保拿到真实尺寸后再定位
 */
watch(
  [isVisable, referenceWidth, referenceHeight, contentWidth, contentHeight],
  ([visible]) => {
    if (!visible) {
      return
    }
    switch (props.placement) {
      // 左上
      case PROP_TOP_LEFT:
        contentStyle.value.top = 0
        contentStyle.value.left = -contentWidth.value + 'px'
        break
      // 右上
      case PROP_TOP_RIGHT:
        contentStyle.value.top = 0
        contentStyle.value.left = referenceWidth.value + 'px'
        break
      // 左下
      case PROP_BOTTOM_LEFT:
        contentStyle.value.top = referenceHeight.value + 'px'
        contentStyle.value.left = -contentWidth.value + 'px'
        break
      // 右下
      case PROP_BOTTOM_RIGHT:
        contentStyle.value.top = referenceHeight.value + 'px'
        contentStyle.value.left = referenceWidth.value + 'px'
        break
    }
  },
  {
    // 等 DOM 更新后再计算，避免拿到旧的尺寸
    flush: 'post'
  }
)

</script>

<script>
const PROP_TOP_LEFT = 'top-left'
const PROP_TOP_RIGHT = 'top-right'
const PROP_BOTTOM_LEFT = 'bottom-left'
const PROP_BOTTOM_RIGHT = 'bottom-right'

// 定义指定位置的 Enum
const placementEnum = [
  PROP_TOP_LEFT,
  PROP_TOP_RIGHT,
  PROP_BOTTOM_LEFT,
  PROP_BOTTOM_RIGHT
]
</script>

<style lang="scss" scoped>
// slide 展示动画
.slide-enter-active {
  transition: opacity 0.3s, transform 0.3s;
}

.slide-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>