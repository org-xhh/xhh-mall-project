<template>
  <div class="goods-detail-page min-width-b">
    <SiteNav />

    <CommonHeader />

    <div class="gap"></div>

    <div class="goods-part">
      <div class="goods-content main-b-width flex space-between">
        <div class="goods-preview-left">
          <div v-if="isVideo" class="video-top">
            <div v-if="isPlaying" class="video-outer">
              <video width="400" height="400" controls="controls" type="video/mp4" autoplay preload="auto">
                <source :src="goodsPreviewImgs[currentImgIndex].video" autostart="false" />
                Your browser does not support the video tag.
              </video>
              <el-icon class="circle-close" @click="closePlayVideo" :size="35"><CircleClose /></el-icon>
            </div>
            <div v-else class="img-outer">
              <img :src="goodsPreviewImgs[currentImgIndex].videocover" />
              <el-icon size="55" class="play-icon" @click="goPlayVideo"><VideoPlay /></el-icon>
            </div>
          </div>
          <div v-else class="preview-top">
            <img :src="goodsPreviewImgs[currentImgIndex].imgUrl" />
            <div
              class="img-cover"
              @mouseenter="imgMouseEnter"
              @mousemove="imgMouseMove"
              @mouseleave="imgMouseLeave"
            ></div>
            <div v-if="isShowEnterBg" class="mouse-enter-bg" :style="enterBgStyle"></div>
          </div>
          <div v-if="isShowZoomImg" class="zoom-img">
            <img :src="goodsPreviewImgs[currentImgIndex].imgUrl" :style="zoomImgStyle" />
          </div>
          <div class="preview-bottom flex">
            <div
              class="direct-arrow left-arrow"
              v-throttle="['click', 500]"
              @click="preImg()"
              :class="{ 'disabled': leftArrowDisabled }"
            >
              <el-icon size="20"><ArrowLeft /></el-icon>
            </div>
            <div class="spec-ul-wrap flex1">
              <ul class="img-spec-ul flex">
                <li
                  v-for="(item, index) in goodsPreviewImgs"
                  :key="index"
                  class="spec-li"
                  :class="{ 'spec-li-active': currentImgIndex === index }"
                  @mouseenter="amplifyImg(index, item)"
                >
                  <img :src="item.imgUrl || item.videocover" />
                </li>
              </ul>
            </div>
            <div
              class="direct-arrow right-arrow"
              v-throttle="['click', 500]"
              @click="nextImg()"
              :class="{ 'disabled': rightArrowDisabled }"
            >
              <el-icon size="20"><ArrowRight /></el-icon>
            </div>
          </div>
        </div>
        <div class="goods-info-right flex1">
          <div class="info-top">商品信息</div>
          <div class="add-cart-wrap">
            <button class="add-cart" @click="addShopCart">加入购物车</button>
            <button class="to-buy" @click="goConfirmOrder">立即购买</button>
          </div>
        </div>
      </div>
    </div>

    <div class="goods-detail-part">
      <div class="goods-detail-content main-b-width">
        <ul class="detail-tab flex" :class="{ 'fixed-detail-tab': isFixedDetailTab }">
          <li
            v-for="(item, index) in detailTabList"
            :key="index"
            class="detail-tab-li flex-center"
            :class="{ 'tab-active': tabIndex === index }"
            @click="clickDetailTab(index)"
          >
            {{ item.content }}
          </li>
        </ul>
        <div class="detail-content-wrap" :style="{ 'padding-top': isFixedDetailTab ? tabHeight + 'px' : '0' }">
          <template v-for="(item, index) in detailTabListContent">
            <div
              v-if="showConCount > detailTabListContent.length - index - 1"
              :key="index"
              :id="'detail-content' + (index + 1)"
              class="detail-content"
            >
              {{ item.content }}
            </div>
          </template>

          <!-- <div v-if="showConCount > 3" id="detail-content1" class="detail-content">商品介绍</div>
          <div v-if="showConCount > 2" id="detail-content2" class="detail-content">规格与包装</div>
          <div v-if="showConCount > 1" id="detail-content3" class="detail-content">售后保障</div>
          <div id="detail-content4" class="detail-content">商品评价</div> -->
        </div>
      </div>
    </div>

    <CommonFooter />

    <ToolBar />
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import SiteNav from '@/components/SiteNav'
import CommonHeader from '@/components/CommonHeader'
import CommonFooter from '@/components/CommonFooter'
import ToolBar from '@/components/ToolBar'

import { useRouter } from 'vue-router'
const router = useRouter()

document.title = '这是某个商品详情'

// 商品预览
let goodsPreviewImgs = reactive([
  {
    imgUrl: new URL('../assets/images/img.jpg', import.meta.url).href
  },
  {
    imgUrl: new URL('../assets/images/demo_jpg1.jpg', import.meta.url).href
  },
  {
    imgUrl: new URL('../assets/images/demo_jpg2.jpg', import.meta.url).href
  },
  {
    video: new URL('../assets/images/normalvideo.mp4', import.meta.url).href,
    videocover: new URL('../assets/images/videocover.png', import.meta.url).href
  },
  {
    imgUrl: new URL('../assets/images/logo.jpg', import.meta.url).href
  }
])
let previewImgWidth = 106 // 318/3
let currentImgIndex = ref(0) // hover
let clickImgIndex = ref(0) // click 查看前后张
const leftArrowDisabled = computed(() => {
  return goodsPreviewImgs.length <= 3 || (goodsPreviewImgs.length > 3 && clickImgIndex.value === 0)
})
const rightArrowDisabled = computed(() => {
  return (
    goodsPreviewImgs.length <= 3 || (goodsPreviewImgs.length > 3 && clickImgIndex.value >= goodsPreviewImgs.length - 3)
  )
})

let isPlaying = ref(false) // 商品图片里的视频
let isVideo = ref(false)

// 放大当前缩略图
function amplifyImg(index, item) {
  if (currentImgIndex.value === index) return
  let allLi = Array.from(document.getElementsByClassName('spec-li'))
  allLi.forEach((liItem) => {
    liItem.classList.remove('spec-li-active')
  })
  document.getElementsByClassName('spec-li')[index].classList.add('spec-li-active')

  currentImgIndex.value = index

  // 判断当前这个是否是视频
  isVideo.value = isPlaying.value ? true : !!item.video
}
let isShowEnterBg = ref(false)
let isShowZoomImg = ref(false)
let enterBgStyle = reactive({
  transform: ''
})
let zoomImgStyle = reactive({
  transform: ''
})
function imgMouseEnter() {
  isShowEnterBg.value = true
  isShowZoomImg.value = true
}
function imgMouseMove(event) {
  // 相对于父元素
  let leftTopX = event.offsetX
  let leftTopY = event.offsetY

  // 限制在框里
  leftTopX = leftTopX - 100 < 0 ? 0 : leftTopX - 100
  leftTopY = leftTopY - 100 < 0 ? 0 : leftTopY - 100
  if (leftTopX > 200) {
    leftTopX = 200
  }
  if (leftTopY > 200) {
    leftTopY = 200
  }

  enterBgStyle.transform = `translate(${leftTopX}px, ${leftTopY}px)`
  zoomImgStyle.transform = `translate(-${2 * leftTopX}px, -${2 * leftTopY}px)`
}
function imgMouseLeave() {
  isShowEnterBg.value = false
  isShowZoomImg.value = false
}
// 上一张图片
function preImg() {
  if (leftArrowDisabled.value) return
  let ele = document.getElementsByClassName('img-spec-ul')[0]
  ele.style.left = (parseFloat(ele.style.left) || 0) + previewImgWidth + 'px'
  clickImgIndex.value--
}
// 下一张图片
function nextImg() {
  if (rightArrowDisabled.value) return
  let ele = document.getElementsByClassName('img-spec-ul')[0]
  ele.style.left = (parseFloat(ele.style.left) || 0) - previewImgWidth + 'px'
  clickImgIndex.value++
}
// 播放
function goPlayVideo() {
  isPlaying.value = true
}
// 点击关闭停止播放
function closePlayVideo() {
  isPlaying.value = false

  // 看当前是在视频或哪张图片上
  isVideo.value = !!goodsPreviewImgs[currentImgIndex.value].video
}
// 加入购物车
let elMsg = null
import { useCounterStore } from '@/store/counter'
function addShopCart() {
  // pinia
  const counter = useCounterStore()
  counter.$patch({
    count: counter.count + 1
  })
  // 或
  // counter.$patch((state) => {
  //   state.count = counter.count + 1
  // })
  // counter.increment()
  elMsg && elMsg.close()
  // eslint-disable-next-line no-undef
  elMsg = ElMessage.success('加入购物车成功')
}

// tab
let detailTabList = reactive([
  {
    content: '商品介绍'
  },
  {
    content: '规格与包装'
  },
  {
    content: '售后保障'
  },
  {
    content: '商品评价(2万+)'
  }
  // {
  //   content: '本店好评商品' // 测试用的，再加一条tab效果依旧ok
  // }
])
let detailTabListContent = reactive([
  {
    content: '商品介绍11'
  },
  {
    content: '规格与包装11'
  },
  {
    content: '售后保障11'
  },
  {
    content: '商品评价(2万+)11'
  }
  // {
  //   content: '本店好评商品11'
  // }
])
let isFixedDetailTab = ref(false) // 是否固定tab
let goodsDetailPartTop = 0
let tabHeight = ref(0) // tab高度
let tabIndex = ref(0)
let showConCount = ref(detailTabList.length - tabIndex.value)
function clickDetailTab(index) {
  if (tabIndex.value === index) return
  tabIndex.value = index
  showConCount = ref(detailTabList.length - tabIndex.value)

  nextTick(() => {
    // 点击tab显示当前tab及后面的内容，固定tab
    window.scrollTo(0, goodsDetailPartTop)
    // 记录一下实际滚动的高度
    let scrolledheight = window.scrollY
    // console.log('scrolledheight:', scrolledheight) // 页面内容较少时
    // 更新rect
    detailConBottomLists = []
    detailTabList.forEach((item, index) => {
      let ele = document.getElementById(`detail-content${index + 1}`) || {}
      let rect = (ele.getBoundingClientRect && ele.getBoundingClientRect()) || {}
      let detailConBottom = rect.bottom || 0

      detailConBottom && (detailConBottom += scrolledheight)
      detailConBottomLists.push(detailConBottom)
    })
  })
}
let detailConBottomLists = []
onMounted(() => {
  console.log('router.currentRoute.value:', router.currentRoute.value)

  getDetailConRect()
  tabHeight.value = document.getElementsByClassName('detail-tab')[0].getBoundingClientRect().height
  goodsDetailPartTop = document.getElementsByClassName('goods-detail-part')[0].getBoundingClientRect().top
  window.addEventListener('scroll', pageScroll)
})
function getDetailConRect() {
  detailConBottomLists = []
  detailTabList.forEach((item, index) => {
    let ele = document.getElementById(`detail-content${index + 1}`) || {}
    let rect = (ele.getBoundingClientRect && ele.getBoundingClientRect()) || {}
    let detailConBottom = rect.bottom || 0

    detailConBottomLists.push(detailConBottom)

    // console.log(detailConBottomLists)
  })
}
function pageScroll() {
  const scrollTop = window.scrollY
  handleTabIndexFn(scrollTop)
}
// tabIndex高亮
function handleTabIndexFn(scrollTop) {
  // tab fixed
  isFixedDetailTab.value = scrollTop >= goodsDetailPartTop

  // 填补的 tabHeight + 'px'
  scrollTop = isFixedDetailTab.value ? scrollTop + tabHeight.value : scrollTop

  for (let index = 0; index < detailConBottomLists.length; index++) {
    let item = detailConBottomLists[index] || {}
    if (scrollTop < item) {
      tabIndex.value = index
      break
    } else if (scrollTop >= item && scrollTop < detailConBottomLists[index + 1]) {
      tabIndex.value = index + 1
      break
    }
  }
}
onUnmounted(() => {
  window.removeEventListener('scroll', pageScroll)
})

// 跳确认订单
function goConfirmOrder() {
  router.replace({
    name: 'confirmOrder'
  })
}
</script>

<style scoped lang="less">
.goods-detail-page {
  background: #fff;
  .site-nav {
    border-bottom: none;
  }
  header {
    border-bottom: none;
  }
  .gap {
    width: 100%;
    height: 10px;
    background-color: @bg-gray-color;
  }
  .goods-part {
    .goods-content {
      background-color: #fff;
      padding-top: 6px;
      .goods-preview-left {
        position: relative; // 右侧放大图片看细节的图片定位使用
        width: 400px;
        .video-top {
          position: relative;
          width: 100%;
          height: 400px;
          border: 1px solid @border-line-color;
          .video-outer {
            .circle-close {
              position: absolute;
              top: 10px;
              right: 10px;
              cursor: pointer;
              color: @primary-color;
            }
          }
          .img-outer {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            img {
              position: absolute;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              width: 100%;
              height: 100%;
            }
            .play-icon {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              cursor: pointer;
              color: @primary-color;
            }
          }
        }
        .preview-top {
          position: relative;
          width: 100%;
          height: 400px;
          border: 1px solid @border-line-color;
          > img {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
          }
          .img-cover {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            z-index: 2; // 层级要高于 mouse-enter-bg
            width: 100%;
            height: 100%;
          }
          .mouse-enter-bg {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 200px;
            height: 200px;
            background-color: #ff0;
            opacity: 0.3;
          }
        }
        .zoom-img {
          position: absolute;
          left: 410px;
          top: 0;
          width: 400px;
          height: 400px;
          overflow: hidden;
          img {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 200%;
            height: 200%;
          }
        }
        .preview-bottom {
          margin-top: 12px;
          height: 90px;
          .direct-arrow {
            width: 29px;
            height: 100%;
            line-height: 100px;
            text-align: center;
            border: 1px solid @border-line-color;
            cursor: pointer;
            &.left-arrow {
              margin-right: 12px;
            }
            &.right-arrow {
              margin-left: 12px;
            }
            &.disabled {
              cursor: not-allowed;
              color: @disabled-font-color;
            }
          }
          .spec-ul-wrap {
            width: 314px;
            overflow: hidden;
            .img-spec-ul {
              position: relative;
              left: 0;
              .spec-li {
                width: 90px;
                height: 90px;
                border: 2px solid #fff;
                cursor: pointer;
                margin: 0 8px;
                flex-shrink: 0; // 宽度不被压缩
                &.spec-li-active {
                  border-color: @primary-color;
                }
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
        }
      }
      .goods-info-right {
        margin-left: 30px;
        .info-top {
          height: 420px;
        }
        .add-cart-wrap {
          padding-left: 300px;
          button {
            height: 46px;
            line-height: 46px;
            // padding: 0 26px;
            width: 140px;
            color: #fff;
            font-size: 18px;
            border: none;
            outline: none;
            cursor: pointer;
            border-radius: 4px;
            &:focus {
              border: none;
              outline: none;
            }
            &:not(:first-child) {
              margin-left: 25px;
            }
            &.add-cart {
              background-color: @primary-color;
            }
            &.to-buy {
              background-color: @orange-color;
            }
          }
        }
      }
    }
  }
  .goods-detail-part {
    margin-top: 40px;
    .goods-detail-content {
      background-color: #fff;
      .detail-tab {
        top: 0;
        width: 100%;
        background-color: @bg-gray-color;
        border: 1px solid @border-line-color;
        border-bottom: 1px solid @primary-color;
        &.fixed-detail-tab {
          position: fixed;
        }
        .detail-tab-li {
          padding: 10px 25px;
          font-size: 14px;
          cursor: pointer;
          transition: background-color 0.2s;
          &.tab-active {
            background: @primary-color;
            color: #fff;
            &:hover {
              color: #fff;
            }
          }
          &:hover {
            color: @primary-color;
          }
        }
      }
      .detail-content {
        background-color: @light-gray-color;
        border-bottom: 1px solid @border-line-color;
        &#detail-content1 {
          height: 650px;
        }
        &#detail-content2 {
          height: 800px;
        }
        &#detail-content3 {
          height: 450px;
        }
        &#detail-content4 {
          height: 780px;
        }
        &#detail-content5 {
          height: 755px;
        }
      }
    }
  }
}
</style>
