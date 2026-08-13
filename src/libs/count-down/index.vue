<template>
  <div>
    <slot>
      <p class="text-sm">
        {{ showTime }}
      </p>
    </slot>
  </div>
</template>

<script>
// 倒计时结束
const EMITS_FINISH = 'finish'
// 倒计时改变
const EMITS_CHANGE = 'change'

</script>

<script setup>
import { onUnmounted, watch, computed, ref, defineEmits, defineProps } from 'vue'
import dayjs from './utils'

// 定时间隔 1000毫秒 = 1秒
const INTERVAL_COUNT = 1000

const emits = defineEmits([EMITS_FINISH, EMITS_CHANGE])
/**
 * 处理显示时间
 */
const showTime = computed(() => {
  return dayjs.duration(duration.value).format(props.format)
})

const props = defineProps({
  // 毫秒
  time: {
    type: Number,
    required: true
  },
  // 遵循 dayjs format 标准：https://day.js.org/docs/zh-CN/parse/string-format
  format: {
    type: String,
    default: 'HH:mm:ss'
  }
})

/**
 * 开始倒计时
 */
const start = () => {
  close()
  interval = setInterval(() => {
    durationFn()
  }, INTERVAL_COUNT)
}
// 倒计时时长
const duration = ref(0)
/**
 * 倒计时行为
 */
const durationFn = () => {
  duration.value -= INTERVAL_COUNT
  emits(EMITS_CHANGE)
  // 监听结束行为
  if (duration.value <= 0) {
    duration.value = 0
    emits(EMITS_FINISH)
    close()
  }
}
/**
 * 清理倒计时
 */
let interval = null
const close = () => {
  if (interval) {
    clearInterval(interval)
  }
}
/**
 * 开始倒计时
 */
watch(
  () => props.time,
  (val) => {
    duration.value = val
    start()
  },
  {
    immediate: true
  }
)
/**
 * 组件销毁时，清理倒计时
 */
onUnmounted(() => {
  close()
})
</script>