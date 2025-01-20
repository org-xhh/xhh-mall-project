<template>
  <div class="sidebar" :class="{ 'fix-sidebar': isFixedBar }">
    <div class="per-item" @click="goChannels" :class="{ 'active': channelActive }">今日秒杀</div>
    <div class="per-item" @click="goRecommend" :class="{ 'active': recommendActive }">为你推荐</div>
    <div v-show="showToTop" class="per-item active" @click="toPageTop">
      <i class="iconfont icon-huidaodingbu"></i>
      顶部
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import { toPageTop, scrollToView } from '@web-xhh/web-utils'

let isFixedBar = ref(false)
let showToTop = ref(false)
let categoryRectBottom = ref(0)

let channelPart = ref(null)
let channelActive = ref(false)
let channelRectTop = ref(0)

let recommendPart = ref(null)
let recommendActive = ref(false)
let recommendRectTop = ref(0)

onMounted(() => {
  // 是否展示回到顶部
  window.addEventListener('scroll', pageScroll)

  let ele = document.getElementsByClassName('category-part')[0] || {}
  let rect = ele.getBoundingClientRect() || {}
  categoryRectBottom.value = rect.bottom

  // 判断滚动时高亮
  let mainEle = document.getElementsByClassName('main-part')[0] || {}
  channelPart.value = mainEle.getElementsByClassName('channel-part')[0] || {}
  channelRectTop.value = channelPart.value.getBoundingClientRect().top || {}

  recommendPart.value = mainEle.getElementsByClassName('recommend-part')[0] || {}
  recommendRectTop.value = recommendPart.value.getBoundingClientRect().top || {}
})
onUnmounted(() => {
  window.removeEventListener('scroll', pageScroll)
})
function pageScroll() {
  const scrollTop = window.scrollY
  // const clientHeight = document.documentElement.clientHeight

  // 是否展示回到顶部
  // showToTop.value = scrollTop >= clientHeight
  showToTop.value = scrollTop > categoryRectBottom.value

  // sidebar位置
  isFixedBar.value = scrollTop > categoryRectBottom.value

  // 判断滚动时高亮
  channelActive.value = scrollTop >= channelRectTop.value && scrollTop < recommendRectTop.value
  recommendActive.value = scrollTop >= recommendRectTop.value
}
// 去今日秒杀
function goChannels() {
  scrollToView(channelPart.value)
}
// 去为你推荐
function goRecommend() {
  scrollToView(recommendPart.value)
}
</script>

<style scoped lang="less">
.html-mini {
  .sidebar {
    margin-left: 540px;
  }
}

.sidebar {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
  z-index: 999;
  background-color: #fff;
  -webkit-box-shadow: -2px 0 30px 2px rgba(97, 105, 119, 0.18);
  -moz-box-shadow: -2px 0 30px 2px rgba(97, 105, 119, 0.18);
  box-shadow: -2px 0 30px 2px rgba(97, 105, 119, 0.18);
  width: 60px;
  margin-left: 640px;
  &.fix-sidebar {
    position: fixed;
    top: 75px;
    animation: barAni 0.5s ease both;
  }
  @keyframes barAni {
    0% {
      top: 0;
    }
    100% {
      top: 75px;
    }
  }
  .per-item {
    position: relative;
    padding: 8px;
    letter-spacing: 2px;
    text-align: center;
    cursor: pointer;
    &.active {
      color: @focus-color;
    }
    &:hover {
      background-color: @focus-color;
      color: #fff !important;
      transition: background-color 0.2s ease;
    }
    &::after {
      position: absolute;
      z-index: -1;
      content: '';
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 35px;
      height: 1px;
      background-color: @border-line-color;
    }
    &:last-child {
      &::after {
        content: none;
      }
    }
    i {
      font-size: 22px;
      height: 25px;
      display: block;
    }
  }
}
</style>
