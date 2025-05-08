<template>
  <div class="home-page min-width-b" v-loading.fullscreen="loadingStore.pageLoading">
    <!-- loadingStore.pageLoading 接口全局loading -->
    <!-- 占位 -->
    <div :style="{ 'height': fixedHeaderHeight + 'px' }">
      <div :class="{ 'fixed-header': isFixedHeader }">
        <SiteNav />
      </div>
    </div>

    <CommonHeader />

    <div class="seamless-wrap main-b-width">
      <ul class="seamless-ul flex">
        <li>从今把定春风笑，且作人间长寿仙</li>
        <li>蟠桃花发一千年。祝长寿、比神仙</li>
        <li>寿远眉毫秀，身康鬓雪稀</li>
        <li>趁锋车未到，霞觞共祝，百千长寿</li>
        <li>愿新春以后，吉吉利利，百事都如意</li>
        <li>清暑玉壶书永，少年金印身轻，他年旌节看归荣。笑傲五湖烟景</li>
      </ul>
    </div>

    <div class="category-part">
      <div class="category-content main-b-width flex">
        <div class="category-left">
          <GoodsCategoryList />
        </div>
        <div class="category-center" id="home-category-center">
          <CarouselPicture :carousel-list="carouselList" testAttrs="111" @emit-carousel="emitCarousel" />
        </div>
        <div class="ad-add" v-if="pageWidth >= limitPageWidth"></div>
        <div class="category-right"></div>
      </div>
    </div>

    <!-- <div>
      {{ $resize }}
      {{ userType }}
    </div> -->

    <main>
      <div class="main-part main-b-width">
        <div class="channel-part flex align-start">
          <div class="second-kill">
            <div class="kill-tit flex-center">今日秒杀</div>
            <div class="kill-icon flex-center">
              <i class="iconfont icon-shandian" />
            </div>
            <div class="count-time flex-center"><strong>08:00</strong>&nbsp;点场，距结束</div>
            <div class="count-down">
              <div class="count-down-inner flex space-around">
                <div class="time">{{ timeObj.hour }}</div>
                <div class="colon">:</div>
                <div class="time">{{ timeObj.minute }}</div>
                <div class="colon">:</div>
                <div class="time">{{ timeObj.second }}</div>
              </div>
            </div>
          </div>
          <div class="second-kill-content flex1">
            <ul class="kill-list flex">
              <li v-for="(item, index) in secondKillList" :key="index" class="kill-li">
                <div class="img-wrap flex-center">
                  <el-icon size="60"><Picture /></el-icon>
                </div>
                <div class="ellipsis2 tit">{{ item.title }}</div>
                <div class="price"><span>¥</span>{{ item.price }}</div>
              </li>
            </ul>
          </div>
          <div class="panic-buy">
            <div class="buy-tit" @click="goWaterfall">优惠包邮</div>
          </div>
        </div>

        <div class="recommend-part">
          <div class="title">为你推荐</div>
          <div class="recommend-list flex flex-wrap">
            <div class="recommend-item view-fade-in-out" v-for="(item, index) in recommendList" :key="index">
              <div class="recommend-item-content" @click="goGoodsDetail(item)">
                <div class="item-content-wrap">
                  <div class="img-wrap">
                    <!-- <img :src="item.img" alt=""> -->
                    <img v-lazy="item.img" />
                  </div>
                  <div class="ellipsis2">{{ item.goodsTitle }}</div>
                  <div class="goods-desc ellipsis1">{{ item.goodsDesc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Sidebar />
    </main>

    <img src="@/assets/images/active_img.jpg" class="drag-img" />

    <CommonFooter />
  </div>
</template>

<script setup>
// import { inject } from 'vue'
import { ref, reactive, onMounted, onUnmounted, getCurrentInstance, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar'
import SiteNav from '@/components/SiteNav'
import CommonHeader from '@/components/CommonHeader'
import GoodsCategoryList from '@/components/GoodsCategoryList'
import CommonFooter from '@/components/CommonFooter'
import CarouselPicture from '@/components/CarouselPicture'
import { recommendList } from '../mockData/home'
import { transferTime, consoleLog } from '@/utils/index'
import seamLessObj from '@/utils/seamLessScroll'

// import { getHomeData } from '@/api/index'
import { useLoadingStore } from '@/store/axiosLoading'
let loadingStore = useLoadingStore()

// 接口地址调用
// getHomeData()
// import.meta是ECMA规范的一部分，模块的上下文信息
console.log('import.meta:', import.meta)

let objTest = { a: '11123' } // 测试浏览器对es2020兼容性
consoleLog().info('objTest?.a', objTest?.a)

// resize
const { proxy, appContext } = getCurrentInstance()
console.log('全局方法', proxy.$resize, appContext.config.globalProperties.$resize)
let resizeFn = proxy.$resize // 方法
let limitPageWidth = resizeFn().limitPageWidth
let pageWidth = ref(resizeFn().docWidth)
window.addEventListener('resize', () => {
  pageWidth.value = resizeFn().docWidth
})
// 获取全局变量 provide inject
// let userType = ref(inject('globalUserType'))

let carouselList = ref([])

function getRecommendData() {
  recommendList.value.push(...recommendList.value)
}
let fixedHeaderHeight = ref(0)
onMounted(() => {
  // 头部固定高度
  fixedHeaderHeight.value = document.getElementById('site-nav').offsetHeight // 37

  window.addEventListener('scroll', pageScroll)

  setTimeout(() => {
    carouselList.value = [
      {
        imgUrl: new URL('../assets/images/img.jpg', import.meta.url).href
      },
      {
        imgUrl: new URL('../assets/images/demo_jpg1.jpg', import.meta.url).href
      },
      {
        imgUrl: new URL('../assets/images/demo_jpg2.jpg', import.meta.url).href
      }
    ]
  })

  setBodyBg('home')

  // 监听页面是否操作
  document.addEventListener('keydown', keydownWatchPage)

  // 无缝滚动，可拖动
  setTimeout(() => {
    seamLessObj.start({
      liMarginRight: 15
    })
  }, 600)

  // 拖动图片
  dragActiveImg()
})

function dragActiveImg() {
  let dragging = false
  let positionX = ''
  let positionY = ''
  let dragImg = document.getElementsByClassName('drag-img')[0] || {}
  dragImg.style.left = document.documentElement.clientWidth - 100 + 'px'
  dragImg.addEventListener('mousedown', (e) => {
    e.preventDefault() // 防止选中图片
    dragging = true
    positionX = e.clientX - dragImg.getBoundingClientRect().left // 鼠标在图片中的位置
    positionY = e.clientY - dragImg.getBoundingClientRect().top
    dragImg.style.cursor = 'grabbing'
  })
  document.addEventListener('mousemove', (e) => {
    if (dragging) {
      let moveClientX = e.clientX - positionX
      let moveClientY = e.clientY - positionY
      // 防止拖动超出页面边界
      if (moveClientX < 0) moveClientX = 0
      if (moveClientY < 0) moveClientY = 0
      if (moveClientX > document.documentElement.clientWidth - dragImg.offsetWidth) {
        moveClientX = document.documentElement.clientWidth - dragImg.offsetWidth
      }
      if (moveClientY > document.documentElement.clientHeight - dragImg.offsetHeight) {
        moveClientY = document.documentElement.clientHeight - dragImg.offsetHeight
      }
      dragImg.style['left'] = moveClientX + 'px'
      dragImg.style['top'] = moveClientY + 'px'
    }
  })
  document.addEventListener('mouseup', () => {
    dragging = false
    dragImg.style.cursor = 'move'
  })
}
function emitCarousel(item) {
  console.log('点击图片 item', item.imgUrl)
}

// 秒杀
let secondKillList = reactive([
  {
    title: '1秒杀商品便宜喽',
    price: '19.9'
  },
  {
    title: '2秒杀商品便宜喽秒杀商品便宜喽',
    price: '45'
  },
  {
    title: '3秒杀商品便宜喽秒杀商品便宜喽秒杀商品便宜喽秒杀商品便宜喽秒杀商品便宜喽',
    price: '1998'
  }
])
let timeObj = reactive({
  hour: 0,
  minute: 0,
  second: 0
})
// 开始倒计时(ms)
let leftTime = 2 * 60 * 60 * 1000
let countDownTimer = null
let timeOver = ref(false)
handleCountDown()
startCountDown()
function handleCountDown() {
  let obj = transferTime(leftTime, true)
  timeObj.hour = obj.hour
  timeObj.minute = obj.minute
  timeObj.second = obj.second
  if (!timeObj.hour && !timeObj.minute && !timeObj.second) {
    clearInterval(countDownTimer)
    timeOver.value = true
  }
}
function startCountDown() {
  countDownTimer = setInterval(() => {
    leftTime -= 1000
    handleCountDown()
  }, 1000)
}
onBeforeUnmount(() => {
  seamLessObj.destroy()
  clearInterval(countDownTimer)
})

onUnmounted(() => {
  window.removeEventListener('scroll', pageScroll)
})

let isFixedHeader = ref(false)
function pageScroll() {
  // 头部固定
  if (window.scrollY > fixedHeaderHeight.value + 122) {
    isFixedHeader.value = true
  } else {
    isFixedHeader.value = false
  }

  const scrollTop = window.scrollY
  const clientHeight = document.documentElement.clientHeight
  const scrollHeight = document.documentElement.scrollHeight
  // 判断时候滚动到底部
  let footerEle = document.getElementsByClassName('footer-content')[0] || {}
  if (scrollTop + clientHeight >= scrollHeight - footerEle.getBoundingClientRect().height - 10) {
    console.log('页面滚动到底部，可以请求下一页啦')
    recommendList.value.length < 120 && getRecommendData()
  }

  // 判断页面是否在滚动
  monitorScroll()
}

const router = useRouter()
// 跳到商品详情
function goGoodsDetail(item) {
  onTimeEnd()
  const { href } = router.resolve({
    path: '/goodsDetail',
    query: { id: item.id || 'id' }
  })
  window.open(href, '_blank')

  // router.push({ path: `/goodsDetail?id=${item.id || 'id'}` })
  setBodyBg()
}
function goWaterfall() {
  onTimeEnd()
  const { href } = router.resolve({
    path: '/waterfallPage'
  })
  window.open(href, '_blank')

  setBodyBg()
}
function setBodyBg(flag) {
  let bodyEle = document.body
  if (flag === 'home') {
    bodyEle.classList.add('body-bg')
  } else {
    bodyEle.classList.remove('body-bg')
  }
}

// 判断页面是否在滚动，在滚动时不使用worker
// eslint-disable-next-line no-unused-vars
let isScrolling = false // 页面是否正在滚动
let scrollTimer = null // 页面滚动定时器
let initPageScrollVal = window.scrollY // 初始时页面滚动高度
// 页面滚动
function monitorScroll() {
  if (window.scrollY - initPageScrollVal > 0) {
    // console.log('向下滚')
    judgeScroll()
  }
  if (window.scrollY - initPageScrollVal < 0) {
    // console.log('向上滚')
    judgeScroll()
  }
  initPageScrollVal = window.scrollY
}
function judgeScroll() {
  // 监听页面滚动，停止worker
  timeCount === 0 && onTimeEnd()
  isScrolling = true
  clearTimeout(scrollTimer)
  scrollTimer = setTimeout(() => {
    // 滚动结束
    isScrolling = false
    // 页面停止滚动，worker重新计时
    timeCount === 0 && onTimeStart()
  }, 300)
}

// 监听页面操作 keydown，重新计时
function keydownWatchPage() {
  if (timeCount === 0) {
    onTimeEnd()
    onTimeStart()
  }
}
let timeCount = 0 // 只提醒一次
// web worker
const myWorker = new Worker('/worker.js')
// 向worker.js线程发送消息，开始
onTimeStart()
myWorker.addEventListener('message', (e) => {
  // 从worker.js接收消息
  console.log(e.data)
  // N分钟内未操作提示页面失效
  if (e.data.sum >= 30) {
    onTimeEnd() // worker.js 停止向主线程发送消息

    let tipTxt = '当前页面长时间未操作'
    // 停留在当前页面失效
    if (document.visibilityState === 'visible') {
      console.log(tipTxt)
      timeCount = 1
    }
    // 切换回当前页面，发现失效
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState == 'visible' && timeCount == 0) {
        console.log(tipTxt)
        timeCount = 1
      }
    })
  }
})
function onTimeStart() {
  myWorker.postMessage('start')
}
function onTimeEnd() {
  myWorker.postMessage('end')
}

// eslint-disable-next-line no-unused-vars
function watchDevTools() {
  setInterval(function () {
    var startTime = performance.now()
    console.log(1)
    // 设置断点，只有打开开发者工具才执行debugger
    // eslint-disable-next-line no-debugger
    debugger
    console.log(2)
    var endTime = performance.now()
    // 设置一个阈值，例如100毫秒
    if (endTime - startTime > 100) {
      window.location.href = 'about:blank'
    }
  }, 100)
}
</script>

<style lang="less">
.body-bg {
  background-color: @bg-gray-color;
}
</style>
<style scoped lang="less">
.home-page {
  background: @bg-gray-color;

  .fixed-header {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 4;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    animation: scrollFixed 0.3s ease-out forwards;
  }
  @keyframes scrollFixed {
    0% {
      top: -80px;
    }
    100% {
      top: 0;
    }
  }

  .title {
    width: 100%;
    text-align: center;
    font-size: 28px;
    font-weight: 700;
    padding: 5px 0;
  }

  .seamless-wrap {
    cursor: pointer;
    user-select: none; /* 禁止文本选择 */
    margin: 10px auto;
    overflow: hidden;
    .seamless-ul {
      li {
        font-size: 13px;
        padding: 4px 10px;
        white-space: nowrap;
        margin-right: 15px;
        background-color: #fffbe8;
        border-radius: 12px;
        color: #ed6a0c;
        &:nth-child(2n) {
          background-color: @primary-light-color;
          color: @primary-color;
        }
        &:nth-child(3n) {
          background-color: #b3c8d9;
          color: #62819e;
        }
      }
    }
  }

  .category-part {
    margin: 10px 0;
    .category-content {
      height: 420px;
      > div {
        background-color: #fff;
        height: 100%;
        &.category-left {
          width: 190px;
        }
        &.category-center {
          width: 790px;
          margin: 0 10px;
          overflow: hidden;
        }
        &.ad-add {
          width: 190px;
          margin-right: 10px;
        }
        &.category-right {
          width: 190px;
        }
      }
    }
  }
  main {
    position: relative;
    .main-part {
      .channel-part {
        background-color: #fff;
        margin-top: 35px;
        .second-kill {
          width: 190px;
          height: 260px;
          padding: 30px 0 20px;
          color: #fff;
          background: #e62b20;
          .kill-tit {
            font-size: 30px;
            font-weight: 700;
          }
          .kill-icon {
            margin: 12px 0 6px;
            .iconfont {
              font-size: 48px;
            }
          }
          .count-time {
            font-size: 14px;
            margin-bottom: 12px;
            strong {
              font-size: 18px;
            }
          }
          .count-down {
            .count-down-inner {
              width: 130px;
              margin: 0 auto;
              .time {
                width: 30px;
                height: 30px;
                line-height: 30px;
                font-size: 20px;
                color: #fff;
                text-align: center;
                background-color: #2f3430;
              }
              .colon {
                height: 30px;
                line-height: 30px;
              }
            }
          }
        }
        .second-kill-content {
          height: 260px;
          .kill-list {
            height: 100%;
            .kill-li {
              position: relative;
              padding: 20px 15px;
              width: 33.33%;
              height: 100%;
              &:last-child {
                &::after {
                  content: '';
                  position: absolute;
                  right: 0;
                  top: 50%;
                  transform: translateY(-50%);
                  width: 1px;
                  height: 200px;
                  background-color: @bg-gray-color;
                }
              }
              &::before {
                content: '';
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 1px;
                height: 200px;
                background-color: @bg-gray-color;
              }
              .img-wrap {
                height: 135px;
              }
              .tit {
                font-size: 12px;
                text-align: center;
              }
              .price {
                font-size: 13px;
                color: @danger-color;
                font-weight: 700;
                margin-top: 10px;
                text-align: center;
                i {
                  font-size: 12px;
                }
              }
            }
          }
        }
        .panic-buy {
          width: 170px;
          padding: 45px 30px 40px;
          background: linear-gradient(to bottom, #fff, #f4f5fa 80%);
          .buy-tit {
            width: 100%;
            font-size: 50px;
            margin: 0 auto;
            letter-spacing: 5px;
            cursor: pointer;
            background-image: -webkit-linear-gradient(
              left,
              @primary-color,
              @focus-color 25%,
              @primary-color 50%,
              @focus-color 75%,
              @primary-color
            );
            -webkit-text-fill-color: transparent;
            background-clip: text;
            background-size: 200% 100%;
            animation: maskedAnimation 4s infinite linear;
          }
          @keyframes maskedAnimation {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: -100% 0;
            }
          }
        }
      }
      .recommend-part {
        margin-top: 15px;
        .recommend-list {
          .recommend-item {
            min-height: 200px;
            width: 20%;
            padding: 0 5px 10px;
            /* 5, 10, 15... */
            &:nth-child(5n) {
              padding-right: 0;
            }
            /* 1, 6, 11... */
            &:nth-child(5n + 1) {
              padding-left: 0;
            }
            .recommend-item-content {
              height: 100%;
              padding-top: 10px;
              background-color: @light-gray-color;
              padding: 5px;
              cursor: pointer;
              .item-content-wrap {
                width: 80%;
                margin: 0 auto;
                .img-wrap {
                  width: 174px;
                  // width: 100%;
                  height: 165px;
                  overflow: hidden;
                  img {
                    width: 100%;
                    height: 100%;
                    transition: all 0.5s;
                    &:hover {
                      transform: scale(1.2);
                    }
                  }
                }
              }
              .goods-desc {
                font-size: 12px;
                color: @gray-font-color;
              }
            }
          }
        }
      }
    }
  }
  .drag-img {
    position: fixed;
    z-index: 1000;
    top: 200px;
    width: 60px;
    cursor: move;
    border-radius: 20px;
    user-select: none;
    touch-action: none; /* 禁用所有浏览器默认的触摸行为 */
  }
}
.html-mini {
  .home-page {
    min-width: @page-s-width;
    .seamless-wrap {
      width: @page-s-width;
    }
    .category-part {
      .category-content {
        width: @page-s-width;
      }
    }
    main {
      .main-part {
        width: @page-s-width;
        .recommend-part {
          .recommend-list {
            .recommend-item {
              .recommend-item-content {
                .item-content-wrap {
                  .img-wrap {
                    width: 142px;
                    height: 136px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
