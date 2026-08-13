<template>
  <div
    class="fixed left-0 top-0 w-screen h-screen z-20 backdrop-blur-4xl bg-transparent pb-2 overflow-y-auto xl:p-2"
  >
    <!-- 移动端下展示 navbar -->
    <m-navbar v-if="isMobileTerminal" @clickLeft="onPop" @clickRight="onPop">
      {{ pexelData.title }}
      <template #right>
        <m-svg-icon
          name="share"
          class="w-3 h-3"
          fillClass="fill-zinc-900 dark:fill-zinc-200"
        ></m-svg-icon>
      </template>
    </m-navbar>
    <!-- pc 端展示关闭图标 -->
    <m-svg-icon
      v-else
      name="close"
      class="w-3 h-3 ml-1 p-0.5 cursor-pointer duration-200 rounded-sm hover:bg-zinc-100 absolute right-2 top-2"
      fillClass="fill-zinc-400"
      @click="onPop"
    ></m-svg-icon>

    <div v-if="pexelData.title" class="xl:w-[80%] xl:h-full xl:mx-auto xl:rounded-lg xl:flex">
      <img
        class="w-screen mb-2 xl:w-3/5 xl:h-full xl:rounded-tl-lg xl:rounded-bl-lg"
        :src="pexelData.photo"
      />
      <div
        class="xl:w-2/5 xl:h-full xl:bg-white xl:dark:bg-zinc-900 xl:rounded-tr-lg xl:rounded-br-lg xl:p-3"
      >
        <div v-if="!isMobileTerminal" class="flex justify-between mb-2">
          <m-svg-icon
          @click="onShareClick"
            name="share"
            class="w-4 h-4 p-1 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800 duration-300 rounded"
            fillClass="fill-zinc-900 dark:fill-zinc-200"
          ></m-svg-icon>

          <m-button
            class=""
            type="info"
            icon="heart"
            iconClass="fill-zinc-900 dark:fill-zinc-200"
          />
        </div>
        <!-- 标题 -->
        <p
          class="text-base text-zinc-900 dark:text-zinc-200 ml-1 font-bold xl:text-xl xl:mb-5"
        >
          {{ pexelData.title }}
        </p>
        <!-- 作者 -->
        <div class="flex items-center mt-1 px-1">
          <img
            v-lazy
            class="h-3 w-3 rounded-full"
            :src="pexelData.avatar"
            alt=""
          />
          <span class="text-base text-zinc-900 dark:text-zinc-200 ml-1">{{
            pexelData.author
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import mNavbar from '@/libs/navbar/index.vue'
import { getPexelsFromId } from '@/api/pexel';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { isMobilephone as isMobileTerminal } from '@/utils/flexible';
import { useStore } from 'vuex';
import {weiboShare} from '@/utils/share.js'

const store = useStore()
const props = defineProps({
  id:{
    type:String,
    required:true
  }
})
const pexelData = ref({})
// 获取详细数据
const getPexelData = async () => {
  const data = await getPexelsFromId(props.id)
  pexelData.value = data
}
getPexelData()
/**
 * 关闭按钮处理事件
 */
const router = useRouter()
const onPop = () => {
    //移动端跳转类型
  store.commit('app/changeRouterType','back')
  router.back()
}
/**
 * 分享按钮点击处理
 */
const onShareClick = () => {
  const data = pexelData.value
  // 链式可选判空，防止任何一层不存在
  const imgUrl = data?.photo
  const targetId = props.id || data?.id
  if (!imgUrl || !targetId) {
    console.log('数据未加载完成，无法分享')
    return
  }
  const shareUrl = `https://imooc-front.lgdsunday.club/pins/${targetId}`
  weiboShare(imgUrl, shareUrl)
}
</script>