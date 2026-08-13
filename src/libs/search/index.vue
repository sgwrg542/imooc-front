<!-- src/libs/search/index.vue -->
<template>
  <div
    class="group relative p-0.5 rounded-xl border-white duration-500 hover:bg-red-100/40"
    ref="containerTarge"
  >
    <div>
      <!-- 搜索图标 -->
      <m-svg-icon
        class="w-1.5 h-1.5 absolute translate-y-[-50%] top-[50%] left-2"
        name="search"
        color="#707070"
      />
      <!-- 输入框 -->
      <input
        class="block w-full h-[44px] pl-4 text-sm outline-0 bg-zinc-100 caret-zinc-400 rounded-xl text-zinc-900 tracking-wide font-semibold border border-zinc-100 duration-1000 group-hover:bg-white group-hover:border-zinc-200 focus:border-red-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 dark:group-hover:bg-zinc-900 dark:group-hover:border-zinc-700"
        type="text"
        placeholder="搜索"
        v-model="inputValue"
        @keyup.enter="onSearchHandlder"
        @focus="onFocusHandlder"
        @blur="onBlurHandlder"
      />
      <!-- 删除按钮 -->
      <m-svg-icon
       v-show="inputValue"
        name="input-delete"
        class="h-1.5 w-1.5 absolute translate-y-[-50%] top-[50%] right-9 duration-500 cursor-pointer"
        @click="onClearClick"
      ></m-svg-icon>
      <!-- 分割线 -->
      <div
        class="opacity-0 h-1.5 w-[1px] absolute translate-y-[-50%] top-[50%] right-[62px] duration-500 bg-zinc-200 group-hover:opacity-100"
      ></div>
      <!-- TODO: 搜索按钮(通用组件) -->
      <m-button
        class="absolute translate-y-[-50%] top-[50%] right-1 rounded-xl duration-500 opacity-0 group-hover:opacity-100"
        icon="search"
        iconColor="#ffffff"
        @click="onSearchHandlder"
      ></m-button>
    </div>
    <!-- 下拉区 -->
    <transition name="slide">
      <div
        v-if="$slots.dropdown"
        v-show="isFocus"
        class="max-h-[368px] w-full text-base overflow-auto bg-white absolute z-20 left-0 top-[56px] p-2 rounded border border-zinc-200 duration-200 hover:shadow-3xl dark:bg-zinc-800 dark:border-zinc-600 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-900 scrollbar-track-transparent"
      >
        <slot name="dropdown" />
      </div>
    </transition>
  </div>
</template>

<script>
const EMIT_UPDATE_MODELVALUE = 'update:modelValue'
// 触发搜索（点击或回车）事件
const EMIT_SEARCH = 'search'
// 删除所有文本事件
const EMIT_CLEAR = 'clear'
// 输入事件
const EMIT_INPUT = 'input'
// 获取焦点事件
const EMIT_FOCUS = 'focus'
// 失去焦点事件
const EMIT_BLUR = 'blur'
</script>

<script setup>
import { onClickOutside, useVModel } from '@vueuse/core'
import { ref, watch } from 'vue'

/**
 * 1. 输入内容实现双向数据绑定
 * 2. 搜索按钮在 hover 是展示
 * 3. 一键清空文本功能
 * 4. 触发搜索
 * 5. 控制下拉展示区的展示
 * 6. 事件处理
 */
const props = defineProps({
  modelValue :{
    required:true,
    type:String
  }
})
const emit = defineEmits([
  EMIT_UPDATE_MODELVALUE,
  EMIT_SEARCH,
  EMIT_CLEAR,
  EMIT_INPUT,
  EMIT_FOCUS,
  EMIT_BLUR
])

const inputValue = useVModel(props)

// 监听童虎输入行为
watch(inputValue,(val) => {
  emit(EMIT_INPUT,val)
})

// 删除事件
const onClearClick = () =>{
    inputValue.value = ''
    emit(EMIT_CLEAR,'')
}

// 搜索
const onSearchHandlder =() =>{
  emit(EMIT_SEARCH,inputValue.value)
}
// input是否获取到焦点
const isFocus = ref(false)
const containerTarge = ref(null)
const onFocusHandlder = () => {
  isFocus.value = true
  emit(EMIT_FOCUS)
}
// 失去焦点
const onBlurHandlder = () => {
  isFocus.value = false
  emit(EMIT_BLUR)
}

onClickOutside(containerTarge,()=> {
  isFocus.value = false
})

</script>

<style lang="scss" scoped>
.slide-enter-active {
  transition: all 0.5s;
}
.slide-leave-active {
  transition: all 0.5s;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateY(40px);
  opacity: 0;
}
</style>