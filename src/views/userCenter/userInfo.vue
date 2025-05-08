<template>
  <div class="user-info-page">
    <div class="flex justify-end header-tab">
      <div @click="toggleAnim(0)" :class="{ 'active': animIndex === 0 }">横向滑入</div>
      <div @click="toggleAnim(1)" :class="{ 'active': animIndex === 1 }">淡入淡出</div>
    </div>
    <ul class="flex tab-list">
      <li
        v-for="(item, index) in tabList"
        :Key="index"
        class="flex1 flex-center"
        :class="{ 'active': currentTabId === item.id }"
        @click="changeTab(item)"
      >
        {{ item.title }}
      </li>
    </ul>
    <div v-if="!toggleLoading" class="main-content" :class="{ 'fade-main-content': animIndex === 1 }">
      {{ currentObj.desc }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, nextTick } from 'vue'

let tabList = ref([
  {
    id: 1,
    title: '我的订单',
    desc: 'order'
  },
  {
    id: 2,
    title: '我的审批',
    desc: 'approval'
  },
  {
    id: 3,
    title: '我的收藏',
    desc: 'collection'
  },
  {
    id: 4,
    title: '消息',
    desc: 'message'
  },
  {
    id: 5,
    title: '浏览记录',
    desc: 'records'
  }
])
let toggleLoading = ref(false)
let currentTabId = ref(1)
let currentObj = reactive({
  desc: 'order'
})
function changeTab(item) {
  if (currentTabId.value === item.id) return
  toggleLoading.value = true
  currentTabId.value = item.id
  currentObj.desc = item.desc
  nextTick(() => {
    toggleLoading.value = false
  })
}

let animIndex = ref(0)
function toggleAnim(index) {
  if (animIndex.value === index) return
  animIndex.value = index
}
</script>

<style scoped lang="less">
.user-info-page {
  overflow: hidden;
  .header-tab {
    margin-bottom: 18px;
    > div {
      cursor: pointer;
      &:not(:first-child) {
        margin-left: 20px;
      }
      &.active {
        color: @warning-color;
      }
    }
  }
  .tab-list {
    border: 1px solid #eee;
    min-height: 44px;
    > li {
      border-right: 1px solid #ddd;
      cursor: pointer;
      &:last-child {
        border-right: none;
      }
      &.active {
        font-weight: bold;
        color: @primary-color;
      }
    }
  }
  .main-content {
    margin-top: 5px;
    padding: 15px;
    min-height: 500px;
    background-color: #eee;
    animation: contentTransform 0.3s;
    &.fade-main-content {
      animation: contentOpacity 0.7s;
    }
  }
  @keyframes contentTransform {
    0% {
      transform: translateX(200%);
    }
    100% {
      transform: translateX(0);
    }
  }
  @keyframes contentOpacity {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
}
</style>
