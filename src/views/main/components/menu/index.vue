<template>
  <div class="py-2 h-[80vh] flex flex-col">
    <h2 class="text-xl text-zinc-900 font-bold mb-2 px-1 dark:text-zinc-200">所有分类</h2>
    <ul class="overflow-y-scroll">
      <li
       v-for="(item, index) in $store.getters.categorys"
        :key="item.id"
        class="text-lg text-zinc-900 px-1 py-1.5 duration-100 active:bg-zinc-100 dark:text-zinc-300 active:dark:bg-zinc-900"
        :class="{
          'bg-zinc-200 dark:bg-zinc-900': currentCategoryIndex === index
        }"
        @click="onItemClick(index)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const emits = defineEmits(['onItemClick'])
const currentCategoryIndex = computed(() => store.getters.currentCategoryIndex)

const onItemClick = (index) => {
  const item = store.getters.categorys[index]
  emits('onItemClick', item)
}
</script>

<style lang="scss" scoped>

</style>