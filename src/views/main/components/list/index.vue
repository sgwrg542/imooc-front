<template>
<div>
  <!-- 列表处理 -->
   <m-infinite-list
   v-model="isLoading"
   :isFinished="isFinished"
   @onLoad="getPexelsData"
   >
    <m-waterfall
  :data="pexelsList"
  nodeKey="id"
  :column="isMobilephone? 2 : 5"
  :picturePreReading="false"
  class=" w-full px-1"
  >
    <template v-slot="{ item, width }">
      <item-vue :data="item" :width="width" @click="onToPins"></item-vue>
    </template>
  </m-waterfall>
   </m-infinite-list>
   <!-- 详情内容展示 -->
    <transition
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <pins-vue v-if="isVisiblePins" :id="currentPins.id" />
    </transition>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getPexelsList } from '@/api/pexel'
import itemVue from './item.vue'
import { isMobilephone } from '@/utils/flexible.js'
import { useStore } from 'vuex'
import pinsVue from '@/views/pins/components/pins.vue'
import gsap from 'gsap'
import { useEventListener } from '@vueuse/core'

const store = useStore()

/**
 * 构建数据请求
 */
let query = {
  page: 1,
  size: 20
}
// 数据是否加载中
const isLoading = ref(false)
// 数据是否加载完成
const isFinished = ref(false)
// 数据源
const pexelsList = ref([])
// 请求序号：用于丢弃过期的请求响应，防止切换分类/搜索时旧数据被写入
let requestId = 0
// 加载数据的方法
const getPexelsData = async () => {
  if (isFinished.value) {
    return
  }

  // 完成第一次请求之后，后续请求让 page 自增
  if (pexelsList.value.length) {
    query.page += 1
  }

  // 记录本次请求的序号
  const currentRequestId = ++requestId

  let res
  try {
    // 触发接口请求
    res = await getPexelsList(query)
  } catch (err) {
    // 仅最新请求需处理错误，避免旧请求弹出无关提示
    if (currentRequestId === requestId) {
      console.error('获取图片列表失败:', err)
      isLoading.value = false
    }
    return
  } finally {
    // 仅最新请求负责复位 loading，避免旧请求覆盖新请求的加载状态
    if (currentRequestId === requestId) {
      isLoading.value = false
    }
  }

  // 若期间发生了重置（切换分类/搜索），则丢弃本次过期响应，避免写入重复/过期数据
  if (currentRequestId !== requestId) {
    return
  }

  // 初始请求清空数据源
  if (query.page === 1) {
    pexelsList.value = res.list
  } else {
    pexelsList.value.push(...res.list)
  }
  // 判断数据是否全部加载完成
  if (pexelsList.value.length === res.total) {
    isFinished.value = true
  }
  // 修改 loading 标记
  isLoading.value = false
}

/**
 * 通过此方法修改 query 请求参数，重新发起请求
 */
const resetQuery = (newQuery) => {
  query = { ...query, ...newQuery }
  // 重置状态
  isFinished.value = false
  pexelsList.value = []
  // 使所有在途请求失效，并复位 loading，让无限列表重新触发加载
  requestId++
  isLoading.value = false
}

/**
 * 监听 currentCategory 的变化
 */
watch(
  () => store.getters.currentCategory,
  (currentCategory) => {
    // 重置请求参数
    resetQuery({
      page: 1,
      categoryId: currentCategory.id
    })
  }
)
/**
 * 监听搜索内容项的变化
 */
watch(
  () => store.getters.searchText,
  (val) => {
    // 重置请求参数
    resetQuery({
      page: 1,
      searchText: val
    })
  }
)

// 控制 pins 展示
const isVisiblePins = ref(false)
// 当前选中的 pins 属性
const currentPins = ref({})

/**
 * 监听浏览器后退按钮事件
 */
useEventListener(window, 'popstate', () => {
  isVisiblePins.value = false
})

/**
 * 进入 pins
 */
const onToPins = (item) => {
  // 注意：必须带 # 前缀，与 createWebHashHistory 保持一致，
  // 否则刷新时 hash 路由读不到 /pins/:id，会跳回首页
  history.pushState(null, null, `#/pins/${item.id}`)
  currentPins.value = item
  isVisiblePins.value = true
}


const beforeEnter = (el) => {
  gsap.set(el, {
    scaleX: 0,
    scaleY: 0,
    transformOrigin: '0 0',
    translateX: currentPins.value.localtion?.translateX,
    translateY: currentPins.value.localtion?.translateY,
    opacity: 0
  })
}
const enter = (el, done) => {
  gsap.to(el, {
    duration: 0.3,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    translateX: 0,
    translateY: 0,
    onComplete: done
  })
}
const leave = (el, done) => {
  gsap.to(el, {
    duration: 0.3,
    scaleX: 0,
    scaleY: 0,
    x: currentPins.value.localtion?.translateX,
    y: currentPins.value.localtion?.translateY,
    opacity: 0
  })
}


</script>