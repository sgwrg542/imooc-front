<template>
  <div class="overflow-auto flex flex-col items-center">
    <m-svg-icon
      v-if="isMobileTerminal"
      name="close"
      class="w-3 h-3 p-0.5 m-1 ml-auto"
      fillClass="fill-zinc-900 dark:fill-zinc-200 "
      @click="close"
    ></m-svg-icon>

    <img
      class="max-w-full max-h-[60vh] object-contain"
      ref="imageTarget"
      :src="blob"
    />

    <m-button
      class="mt-4 w-[80%] xl:w-1/2"
      :loading="loading"
      @click="onConfirmClick"
    >确定</m-button>
  </div>
</template>

<script>

// 移动端配置对象
const mobileOptions = {
  // 将裁剪框限制在画布的大小
  viewMode: 1,
  // 移动画布，裁剪框不动
  dragMode: 'move',
  // 裁剪框固定纵横比：1:1
  aspectRatio: 1,
  // 裁剪框不可移动
  cropBoxMovable: false,
  // 不可调整裁剪框大小
  cropBoxResizable: false
}
// PC 端配置对象
const pcOptions = {
  // 裁剪框固定纵横比：1:1
  aspectRatio: 1
}
const EMITS_CLOSE = 'close'
</script>

<script setup>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { isMobilephone as isMobileTerminal } from '@/utils/flexible'
import { onMounted, ref } from 'vue'
import { message } from '@/libs'
import { putObject } from '@/utils/cos'


defineProps({
  blob: {
    type: String,
    required: true
  }
})

const emits = defineEmits([EMITS_CLOSE, 'update-avatar'])

/**
 * 确定按钮点击事件
 */
const loading = ref(false)
const onConfirmClick = async () => {
  // 开启 loading
  loading.value = true
  try {
    // 1. 获取裁剪后的图片 blob（裁剪 canvas 转成 png 图片）
    const blob = await new Promise((resolve) => {
      cropper.getCroppedCanvas().toBlob(resolve, 'image/png')
    })
    // 2. 转成带文件名的 File（Blob 没有 name 属性，COS 对象键需要用到文件名）
    const file = new File([blob], `avatar_${Date.now()}.png`, {
      type: 'image/png'
    })
    // 3. 前端直传 COS，并监听上传进度
    const url = await putObject(file, (progressData) => {
      // progressData.percent 为 0~1
      console.log('上传进度：', Math.round(progressData.percent * 100) + '%')
    })
    // 4. 上传成功，把新的头像地址交回父组件（由父组件负责保存到后端并提示）
    emits('update-avatar', url)
    // 关闭弹窗
    emits(EMITS_CLOSE)
  } catch (err) {
    // 提取 COS 返回的具体错误信息（如 CORS、签名、权限问题），方便排查
    const reason =
      (err && (err.message || (err.Error && err.Error.Message))) || '未知错误'
    console.error(err)
    message('error', `头像上传失败：${reason}`)
  } finally {
    loading.value = false
  }
}


/**
 * 关闭事件
 */
const close = () => {
  emits(EMITS_CLOSE)
}



/**
 * 图片裁剪处理
 */
const imageTarget = ref(null)
let cropper = null
onMounted(() => {
  /**
   * 接收两个参数：
   * 1. 需要裁剪的图片 DOM
   * 2. options 配置对象
   */
  cropper = new Cropper(
    imageTarget.value,
    isMobileTerminal.value ? mobileOptions : pcOptions
  )
})
</script>