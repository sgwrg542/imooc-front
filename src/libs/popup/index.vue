<template>
  <div>
     <teleport to="body">
      <!-- 蒙版 -->
       <transition name="fade">
        <div
         v-if="isOpen"
          class="w-screen h-screen bg-zinc-900/80 z-40 fixed top-0 left-0"
          @click="isOpen = false"
        ></div>
       </transition>
      <!-- 内容 -->
       <transition name="popup-down-up">
        <div
        v-if="isOpen"
          v-bind="$attrs"
          class="w-screen bg-white z-50 fixed bottom-0 dark:bg-zinc-800"
        >
        <slot />
      </div>
       </transition>
     </teleport>
  </div>
</template>

<script setup>
import { useScrollLock, useVModel } from '@vueuse/core'
import { watch } from 'vue'
const props = defineProps({
  modelValue: {
    required: true,
    type: Boolean
  }
})

// const emits = defineEmits(['update:modelValue'])
const isOpen = useVModel(props)

// ------ 滚动锁定 ------
// 标准文档下页面滚动发生在 html(scrollingElement)上,需同时锁 html 和 body 才能阻止滚动
const isLocked = useScrollLock(document.documentElement)
const isBodyLocked = useScrollLock(document.body)
watch(
  isOpen,
  (val) => {
    isLocked.value = val
    isBodyLocked.value = val
  },
  {
    immediate: true
  }
)
</script>



<style lang="scss" scoped>
// fade 展示动画
.fade-enter-active {
  transition: all 0.3s;
}
.fade-leave-active {
  transition: all 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// popup-down-up 展示动画
.popup-down-up-enter-active {
  transition: all 0.3s;
}

.popup-down-up-leave-active {
  transition: all 0.3s;
}

.popup-down-up-enter-from,
.popup-down-up-leave-to {
  transform: translateY(100%);
}
</style>