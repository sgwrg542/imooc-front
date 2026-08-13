<script setup>
import { ref } from 'vue';

</script>

<template>
  <!-- 一级路由出口 -->
  <div class="h-screen">
    <!-- <router-view /> -->
     <m-transition-router-view
     :routerType="$store.getters.routerType"
     mainComponentName="home"
     >
     </m-transition-router-view>
  </div>
</template>
