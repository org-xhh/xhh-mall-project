<template>
  <div class="coupon-info">
    <div class="center-content flex-center direction-column">
      <div v-if="!isLotteryDraw && prizeResult" class="prize-result">{{ prizeResult }}</div>
      <div class="container">
        <ul class="list">
          <li :class="{ 'active': activeIndex === 0 }">￥10</li>
          <li :class="{ 'active': activeIndex === 1 }">￥100</li>
          <li :class="{ 'active': activeIndex === 2 }">￥5</li>
          <li :class="{ 'active': activeIndex === 7 }">￥150</li>
          <li class="button" :class="{ 'disabled': isLotteryDraw }" @click="startLotteryDraw">开始抽奖</li>
          <li :class="{ 'active': activeIndex === 3 }">￥1</li>
          <li :class="{ 'active': activeIndex === 6 }">￥20</li>
          <li :class="{ 'active': activeIndex === 5 }">￥200</li>
          <li :class="{ 'active': activeIndex === 4 }">再接再厉</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import { randomNum } from '@web-xhh/web-utils'

// 正在抽奖
let isLotteryDraw = ref(false)
// 高亮
let activeIndex = ref(-1)

let runTimes = 0 // 跑动的总次数
let t = 200 // 跑动间隔，初始200ms
let rounds = 3
let roundCount = rounds * 8 // 跑rounds圈，然后随机跑停下
let timer = null // 跑动定时器，由快到慢直至停止
let prizeResultIndex = -1 // 抽中某一个
// 点击开始抽奖
function startLotteryDraw() {
  if (isLotteryDraw.value) return
  activeIndex.value = -1
  isLotteryDraw.value = true
  // 每次随机获取一个抽中奖品
  prizeResultIndex = randomNum(0, 7)
  console.log('抽中', prizeResultIndex)

  timer = setTimeout(startScroll, t)
  function startScroll() {
    activeIndex.value = runTimes % 8
    runTimes++

    if (runTimes > roundCount - 8 && runTimes < roundCount + (prizeResultIndex + 1)) {
      // 跑完rounds-1圈，从第rounds圈开始减速
      t += (runTimes - roundCount + 8) * 5
      timer = setTimeout(startScroll, t)
    } else if (runTimes >= roundCount + (prizeResultIndex + 1)) {
      // 结束，重置
      resetData()
    } else {
      // 四圈内正常速度
      timer = setTimeout(startScroll, t)
    }
  }
}
function resetData() {
  clearTimeout(timer)
  timer = null
  isLotteryDraw.value = false
  runTimes = 0
  t = 200
}

// 抽奖结果
const prizeResult = computed(() => {
  if (activeIndex.value === 0) {
    return '恭喜你抽中10元优惠券'
  } else if (activeIndex.value === 1) {
    return '恭喜你抽中100元优惠券'
  } else if (activeIndex.value === 2) {
    return '恭喜你抽中5元优惠券'
  } else if (activeIndex.value === 3) {
    return '恭喜你抽中1元优惠券'
  } else if (activeIndex.value === 4) {
    return '再接再厉'
  } else if (activeIndex.value === 5) {
    return '恭喜你抽中200元优惠券'
  } else if (activeIndex.value === 6) {
    return '恭喜你抽中20元优惠券'
  } else if (activeIndex.value === 7) {
    return '恭喜你抽中150元优惠券'
  } else {
    return ''
  }
})
</script>

<style scoped lang="less">
.coupon-info {
  .center-content {
    position: relative;
    .prize-result {
      position: absolute;
      top: 20px;
      background-color: #000;
      padding: 5px 40px;
      color: #fff;
    }
    .container {
      border: 7px solid blue;
      padding: 15px;
      border-radius: 10px;
      margin-top: 100px;
      .list {
        overflow: hidden;
        width: 330px;
        height: 330px;
        > li {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          float: left;
          margin: 5px;
          background-color: @warning-color;
          color: @primary-color;
          font-size: 18px;
          font-weight: bold;
          border: 3px solid transparent;
          &.active {
            border: 3px solid @focus-color;
          }
          &.button {
            background-color: @danger-color;
            cursor: pointer;
            color: #fff;
            &.disabled {
              background-color: @light-gray-color;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }
}
</style>
