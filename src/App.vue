<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <!-- :key="$route.fullPath" 解决 replace userCenter 当前页不刷新问题 -->
  <RouterView :key="$route.fullPath" />
</template>
