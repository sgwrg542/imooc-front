<template>
  <mobile-navigation-vue v-if="isMobilephone"
  :data="CategoryData"
   />
   <pc-navigation-vue v-else></pc-navigation-vue>
</template>

<script setup>
import { isMobilephone } from '@/utils/flexible'
import mobileNavigationVue from './mobile/index.vue'
import pcNavigationVue from './pc/index.vue'
import { useStore } from 'vuex'


const store = useStore()
// 触发category获取数据
store.dispatch('category/useCategoryData')
</script>