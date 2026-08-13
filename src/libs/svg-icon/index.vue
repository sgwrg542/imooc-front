<template>
  <svg aria-hidden="true">
    <use :class="fillClass" :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 图标名称（传入时不带 icon- 前缀）
  name: {
    type: String,
    required: true
  },
  // 直接设置图标填充颜色
  color: {
    type: String
  },
  // tailwind 类名控制颜色
  fillClass: {
    type: String
  }
})

// 拼接 symbol 的id：#icon-xxx
const symbolId = computed(() => `#icon-${props.name}`)
</script>