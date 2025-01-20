<template>
  <div class="carousel-picture-comp" v-if="carouselList && carouselList.length">
    <div class="carousel-box">
      <ul class="carousel-ul flex" :style="carouselWidth">
        <li
          v-for="(item, index) in carouselList"
          :key="index"
          @click="emitCarousel(item)"
          :style="{ 'width': categoryEleWidth + 'px' }"
        >
          <img :src="item.imgUrl" />
        </li>
        <!-- 填补第一张，快速切换到真实的第一张，起到过渡的动画效果 -->
        <li
          v-if="carouselList.length > 1"
          data-index="copyfirst"
          @click="emitCarousel(carouselList[0])"
          :style="{ 'width': categoryEleWidth + 'px' }"
        >
          <img :src="carouselList[0].imgUrl" />
        </li>
      </ul>

      <!-- 上一张下一张 -->
      <div class="toggle-picture" v-if="carouselList.length > 1">
        <div class="pre flex-center" @click="clickPre"><i class="iconfont icon-jiantouyou" /></div>
        <div class="next flex-center" @click="clickNext"><i class="iconfont icon-jiantouyou" /></div>
      </div>

      <!-- dot -->
      <ul class="dot-ul flex" v-if="carouselList.length > 1">
        <li
          v-for="(dotItem, dotIndex) in carouselList"
          class="flex1"
          :class="{ 'active': currIndex === dotIndex }"
          :key="dotIndex"
          @mouseenter="mouseenter(dotIndex)"
          @mouseleave="mouseleave"
        ></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount, watch, useAttrs } from 'vue'
const props = defineProps({
  carouselList: Array
})

// 包含父作用域里除 class 和 style 除外的非 props 属性集合
const attrs = useAttrs()
console.log('useAttrs', attrs)

let carouselWidth = ref(0)
// 每个li的宽度
let categoryEleWidth = ref(0)
let currIndex = ref(0)
let carouselTimer = null

watch(
  () => props.carouselList,
  () => {
    setCarouselWidth()

    startScroll()
  },
  { deep: true }
)
onBeforeUnmount(() => {
  clearInterval(carouselTimer)
})

function setCarouselWidth() {
  let homeEle = document.getElementsByClassName('home-page')[0] || {}
  let categoryEle = homeEle.getElementsByClassName('category-center')[0] || {}
  categoryEleWidth.value = categoryEle.getBoundingClientRect().width || {}

  if (props.carouselList.length === 1) {
    carouselWidth.value = {
      width: '100%'
    }
  } else {
    carouselWidth.value = {
      width: categoryEleWidth.value * (props.carouselList.length + 1) + 'px'
    }
  }
}
function startScroll() {
  let carouselLen = props.carouselList && props.carouselList.length
  if (carouselLen > 1) {
    clearInterval(carouselTimer)
    carouselTimer = setInterval(() => {
      if (currIndex.value < carouselLen) {
        currIndex.value++
      } else {
        currIndex.value = 0
      }
      scrollCarousel(currIndex)
    }, 3000)
  }
}
// 动画
function scrollCarousel(currIndex, callback) {
  let ulEle = document.getElementsByClassName('carousel-ul')[0]
  let li = ulEle && ulEle.getElementsByTagName('li')
  if (ulEle) {
    ulEle.style['transform'] = 'translate3d(-' + (100 / li.length) * currIndex.value + '%,0px,0px)'
    ulEle.style['transition'] = '-webkit-transform 300ms'
    setTimeout(() => {
      if (currIndex.value === props.carouselList.length) {
        ulEle.style['transform'] = 'translate3d(0%,0px,0px)'
        ulEle.style['transition'] = '-webkit-transform 0ms'
        // 当前index置为0
        currIndex.value = 0
      }
      // 应该是300ms动画完成之后更改，但是currIndex高亮会变得慢
    }, 200)

    // 手动点击上一张下一张之后，清空定时器，重新跑
    callback && callback()
  }
}

// 上一张
function clickPre() {
  let carouselLen = props.carouselList && props.carouselList.length
  let ulEle = document.getElementsByClassName('carousel-ul')[0]
  let li = ulEle && ulEle.getElementsByTagName('li')
  if (ulEle) {
    // 当前在第一张
    if (currIndex.value === 0) {
      currIndex.value = carouselLen - 1

      // 填补的第一张图片，在最后
      ulEle.style['transform'] = 'translate3d(-' + (100 / li.length) * (currIndex.value + 1) + '%,0px,0px)'
      ulEle.style['transition'] = '-webkit-transform 0ms'
      setTimeout(() => {
        // 动画过渡到最后一张图片
        ulEle.style['transform'] = 'translate3d(-' + (100 / li.length) * currIndex.value + '%,0px,0px)'
        ulEle.style['transition'] = '-webkit-transform 300ms'

        startScroll()
      })
    } else {
      currIndex.value--

      scrollCarousel(currIndex, () => {
        startScroll()
      })
    }
  }
}
// 下一张
function clickNext() {
  let carouselLen = props.carouselList && props.carouselList.length
  if (currIndex.value < carouselLen) {
    currIndex.value++
  } else {
    currIndex.value = 0
  }
  scrollCarousel(currIndex, () => {
    startScroll()
  })
}
// 鼠标移入
function mouseenter(dotIndex) {
  currIndex.value = dotIndex
  clearInterval(carouselTimer)
  let ulEle = document.getElementsByClassName('carousel-ul')[0]
  let li = ulEle && ulEle.getElementsByTagName('li')
  ulEle.style['transform'] = 'translate3d(-' + (100 / li.length) * currIndex.value + '%,0px,0px)'
  ulEle.style['transition'] = '-webkit-transform 0ms'
}
// 鼠标移出
function mouseleave() {
  startScroll()
}

// 点击图片
const emitEvent = defineEmits(['emitCarousel'])
function emitCarousel(item) {
  emitEvent('emitCarousel', item)
}
</script>

<style lang="less" scoped>
@import './index.less';
</style>
