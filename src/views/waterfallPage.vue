<template>
  <div class="waterfall-page min-width-b">
    <SiteNav />

    <CommonHeader />

    <main>
      <div class="main-content main-b-width">
        <ul class="waterfall-list" :style="{ 'min-height': Math.max(...rowHeightList) + 50 + 'px' }">
          <li v-for="(item, index) in imgList" :key="index" class="li flex direction-column">
            <img class="img" :data-src="item.src" />
            <div class="bottom-btn">
              <div class="bottom-top">
                <span><i class="iconfont icon-yishou"></i>29</span>
                <span><i class="iconfont icon-xihuan"></i>8</span>
              </div>
              <div class="bottom-bottom">立即抢购</div>
            </div>
          </li>
        </ul>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import SiteNav from '@/components/SiteNav'
import CommonHeader from '@/components/CommonHeader'

onMounted(() => {
  // 瀑布流布局
  waterFall()

  init()
})

let rowHeightList = reactive([])
function waterFall() {
  let container = document.getElementsByClassName('waterfall-list')[0]
  let item = container.getElementsByClassName('li')

  // 获取元素的宽度(offsetWidth 含border，padding)
  let width = item[0].offsetWidth

  let clientWidth = container.clientWidth
  // 计算出应该放几列（向下取整）
  let columnCount = Math.floor(clientWidth / width)

  // 第一行的top值都是0，后面的依次找上一行高度最小的容器，在它下面进行排列
  for (let i = 0; i < item.length; i++) {
    // 定位第一行的图片
    if (i < columnCount) {
      item[i].style.top = '0px'
      item[i].style.left = i * width + 'px'
      rowHeightList.push(item[i].offsetHeight)
    } else {
      // 第一行之后的，先选择总高度最小的列
      let min = Math.min(...rowHeightList)
      let index = rowHeightList.indexOf(min)
      // 将每个元素定位到当前总高度最小的列下
      item[i].style.top = min + 'px'
      item[i].style.left = index * width + 'px'
      // 更新每个item当前高度
      rowHeightList[index] += item[i].offsetHeight
    }
  }
}

function init() {
  try {
    if (IntersectionObserver) {
      observerLoadFn()
    } else {
      // 传统的图片懒加载
      getBoundRectLoad()
    }
  } catch (e) {
    getBoundRectLoad()
  }
}
function observerLoadFn() {
  let observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        let target = entry.target
        // console.log(entry.intersectionRatio, entry.isIntersecting)
        // 有时isIntersecting可见，intersectionRatio却为0，修复一下
        if (
          (entry.intersectionRatio > 0 && entry.intersectionRatio <= 1) ||
          (entry.intersectionRatio === 0 && entry.isIntersecting)
        ) {
          if (target.dataset.src) {
            target.src = target.dataset.src
            target.removeAttribute('data-src')
            // 图片已加载， 解除观察
            observer.unobserve(target)
          } else {
            observer.unobserve(target)
          }
        }
      })
    },
    { threshold: [0] } // 默认
  )

  function query(selector) {
    return Array.from(document.querySelectorAll(selector))
  }

  query('.img').forEach(function (item) {
    // 观察每个图片对象
    observer.observe(item)
  })
}

// 传统的图片懒加载
function getBoundRectLoad() {
  // 页面初始化判断需要显示的图片
  imgLoadFn()

  window.addEventListener('scroll', function () {
    imgLoadFn()
  })
}
function imgLoadFn() {
  let imgGroups = document.getElementsByClassName('img')
  let imgGroupLen = imgGroups && imgGroups.length
  // 最后一张图片还没加载出来，说明需要懒加载
  if (imgGroupLen && imgGroups[imgGroupLen - 1].getAttribute('data-src')) {
    for (let i = 0; i < imgGroups.length; i++) {
      let imgItem = imgGroups[i] || {}
      if (imgItem.getAttribute('data-src')) {
        loadImg(imgItem)
      }
    }
  }
}
function loadImg(el) {
  // 获取窗口高度
  let docHeight = document.documentElement.clientHeight
  let boundingClientRect = el.getBoundingClientRect()
  let bottom = boundingClientRect.bottom
  let top = boundingClientRect.top
  /* 当元素进入窗口时，才加载真实图片
    bottom： 元素的下边到窗口上边的距离
    top： 元素的上边到窗口上边的距离
  */
  if (top < docHeight && bottom > 0) {
    el.src = el.dataset.src
    el.removeAttribute('data-src')
  }
  // top >= docHeight || bottom <= 0 // 不可见
}

// 打包后没有这些动态引入的图片，找不到
// const imgDataSrc = computed(() => {
//   return function (i) {
//     return new URL('../assets/images/imgs/img(' + (i > 24 ? (49 - i <= 0 ? 1 : 49 - i) : i) + ').jpg', import.meta.url)
//       .href
//   }
// })

const imgDemoList = [
  {
    src: new URL('../assets/images/imgs/img(1).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(2).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(3).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(4).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(5).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(6).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(7).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(8).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(9).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(10).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(11).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(12).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(13).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(14).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(15).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(16).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(17).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(18).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(19).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(20).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(21).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(22).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(23).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(24).jpg', import.meta.url).href
  },
  {
    src: new URL('../assets/images/imgs/img(2).jpg', import.meta.url).href
  }
]
const imgList = imgDemoList.concat(imgDemoList)
</script>

<style scoped lang="less">
.waterfall-page {
  main {
    padding-top: 20px;
    background-color: @light-gray-color;
    .main-content {
      .waterfall-list {
        position: relative;
        width: 100%;
        .li {
          position: absolute;
          padding: 8px;
          cursor: pointer;
          .bottom-btn {
            width: 100%;
            background-color: #fff;
            border-radius: 0 0 4px 4px;
            border: 1px solid @border-line-color;
            border-top: none;
            .bottom-top {
              position: relative;
              height: 30px;
              line-height: 30px;
              padding-left: 10px;
              font-size: 12px;
              color: @gray-font-color;
              &::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 200%;
                height: 1px;
                background-color: @light-gray-color;
                transform: scale(0.5);
                transform-origin: 0 0;
              }
              > span {
                margin-right: 10px;
              }
              .iconfont {
                font-size: 13px;
                margin-right: 2px;
                vertical-align: middle;
              }
            }
            .bottom-bottom {
              height: 35px;
              line-height: 35px;
              padding-left: 10px;
              font-size: 12px;
              color: @orange-color;
            }
          }
          &:nth-child(3n) {
            > img {
              height: 260px;
            }
          }
          > img {
            width: 222px;
            height: 184px;
            border-radius: 4px 4px 0 0;
            background-color: @light-gray-color;
          }
        }
      }
    }
  }
}
</style>
