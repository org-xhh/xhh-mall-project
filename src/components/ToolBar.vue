<template>
  <div class="project-toolbar">
    <div class="bar-item">
      <div class="bar-icon flex-center">
        <i class="iconfont icon-huiyuan" />
      </div>
      <div class="tab-text">我的会员</div>
    </div>
    <div class="bar-item" v-if="routeName !== 'shopCart'">
      <div class="bar-icon flex-center">
        <el-icon size="22"><ShoppingCartFull /></el-icon>
      </div>
      <div class="tab-text">购物车</div>
    </div>
    <div class="bar-item">
      <div class="bar-icon flex-center">
        <i class="iconfont icon-youhuiquan" />
      </div>
      <div class="tab-text">优惠券</div>
    </div>
    <div class="bar-item" @click="toPageTop">
      <div class="bar-icon flex-center">
        <i class="iconfont icon-huidaodingbu" />
      </div>
      <div class="tab-text">回到顶部</div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { toPageTop } from '@web-xhh/web-utils'

import { useRouter } from 'vue-router'
const router = useRouter()
let routeName = router.currentRoute.value.name

onMounted(() => {
  let toolBarEle = document.getElementsByClassName('project-toolbar')[0] || {}
  let barItemEle = toolBarEle.getElementsByClassName('bar-item')
  barItemEle = Array.from(barItemEle)
  barItemEle.forEach((item) => {
    item.addEventListener('mouseenter', (e) => {
      let target = e.target || e.srcElement
      target.classList.add('hover-style')
    })
    item.addEventListener('mouseleave', (e) => {
      let target = e.target || e.srcElement
      target.classList.remove('hover-style')
    })
  })
})
</script>

<style scoped lang="less">
.project-toolbar {
  position: fixed;
  bottom: 100px;
  right: 0;
  width: 35px;
  .bar-item {
    position: relative;
    width: 35px;
    height: 35px;
    margin-bottom: 1px;
    cursor: pointer;
    border-radius: 3px 0 0 3px;
    &.hover-style {
      .bar-icon {
        background-color: @primary-color;
      }
      .tab-text {
        left: -60px;
        background-color: @primary-color;
      }
    }
    .bar-icon {
      position: relative;
      z-index: 2;
      width: 100%;
      height: 100%;
      background-color: @dark-gray-color;
      i {
        font-size: 20px;
        color: #fff;
      }
    }
    .tab-text {
      position: absolute;
      z-index: 1;
      left: 35px;
      top: 0px;
      width: 62px;
      height: 35px;
      line-height: 35px;
      color: rgb(255, 255, 255);
      text-align: center;
      background-color: rgb(122, 110, 110);
      border-radius: 3px 0px 0px 3px;
      transition: left 0.3s ease-in-out 0.1s;
    }
  }
}
</style>
