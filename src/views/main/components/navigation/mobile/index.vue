<template>
  <div class=" bg-white sticky top-0 left-0 z-10 dark:bg-zinc-900 duration-500">
    <ul 
    ref="ulTarget"
    class=" relative flex overflow-x-auto p-1 text-xs text-zinc-600 overflow-hidden"
    >
      <!-- 滑块 -->
       <li
      ref="sliderTarget"
       class=" absolute  top-[5px] h-[22px] bg-zinc-900 rounded-lg duration-200 dark:bg-zinc-800" 
       :style="sliderStyle"
       >
       </li>
       <!-- 汉堡按钮 -->
      <li
          class="z-20 fixed top-0 right-[-1px] h-[0.85rem] px-1 flex items-center bg-white shadow-l-white  dark:bg-zinc-900 dark:shadow-l-zinc"
          @click="isOpenPopup = !isOpenPopup"
        >
          <m-svg-icon class="w-1.5 h-1.5" name="hamburger" ></m-svg-icon>
      </li>
      <!-- item -->
      <li 
      v-for="(item, index) in $store.getters.categorys"
      :key="item.id"
      class="nav-item shrink-0 px-1.5 z-10 duration-200 last:mr-3 "
      :ref="setItemRef"
      @click="onItemClick(item)"
      :class="{ 'text-zinc-100': $store.getters.currentCategoryIndex === index }"
      >    
        {{ item.name }}  
      </li>
    </ul>
    <m-popup v-model="isOpenPopup">
      <menu-vue @onItemClick="onItemClick"></menu-vue>
    </m-popup>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onBeforeUpdate, computed } from 'vue'
import { useScroll } from '@vueuse/core'
import { useStore } from 'vuex'
import MenuVue from '@/views/main/components/menu/index.vue'

const store = useStore()


// 滑块
const sliderStyle = ref({
  transform: 'translateX(0px)',
  width: '52px'
})

// 选中的 item 下标（通过 vuex 共享状态）
// const currentCategoryIndex = computed({
//   get: () => store.getters.currentCategoryIndex,
//   set: (val) => store.commit('category/changeCurrentCategoryIndex', val)
// })

// 获取填充的所欲item元素
let itemRefs = []
const setItemRef = (el) => {
  if(el){
  itemRefs.push(el)
 }
}
onBeforeUpdate(() => {
  itemRefs = []
})

// 获取 ul 元素，以计算偏移位置
const ulTarget = ref(null)
const { x: ulScrollLeft } = useScroll(ulTarget)

watch(
 () => store.getters.currentCategoryIndex, 
  async (val) => {
  // 获取选中元素的 left、width
  const { left, width } = itemRefs[val].getBoundingClientRect()
  // 为 sliderStyle 设置属性
  sliderStyle.value = {
    // ul 横向滚动位置 + 当前元素的 left 偏移量
    transform: `translateX(${ulScrollLeft.value + left - 10 + 'px'})`,
    width: width + 'px'
  }
})


// item点击事件
const onItemClick = (item) => {
  store.commit('app/changeCurrentCategory', item)
  isOpenPopup.value = false
}
const isOpenPopup = ref(false)

</script>