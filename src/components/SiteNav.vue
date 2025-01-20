<template>
  <div class="site-nav" id="site-nav">
    <div class="site-nav-content main-b-width flex space-between align-center">
      <div class="nav-left flex align-center">
        <div v-if="routeName !== 'home'" class="nav-info flex align-center" @click="goHome">
          <i class="iconfont icon-zhuye1" />首页
        </div>
        <div class="nav-info flex align-center"><i class="iconfont icon-dizhiguanli addr-icon" />江苏</div>
      </div>
      <ul class="nav-right flex align-center">
        <li class="split"></li>
        <li v-if="!token" class="nav-item flex align-center" @click="goLogin">
          <div class="nav-item-con nav-item-con-hover flex-center">请登录</div>
        </li>
        <el-popover v-else :visible="exitVisible" trigger="click" placement="bottom" :width="160">
          <div class="exit-popover">
            <div class="con flex-center">欢迎珺墩墩小可爱</div>
            <div class="flex space-between">
              <el-button size="small" @click="exitVisible = false">取消</el-button>
              <el-button size="small" @click="exitLogin">退出登录</el-button>
            </div>
          </div>
          <template #reference>
            <li class="nav-item" @click="exitVisible = true">
              <div class="nav-item-con flex-center">你好, &nbsp;<span class="highlight-font">珺墩墩</span></div>
            </li>
          </template>
        </el-popover>

        <template
          v-if="routeName !== 'userCenter' || (routeName === 'userCenter' && routeParamsOrigin !== 'orderList')"
        >
          <li class="split"></li>
          <li class="nav-item flex align-center" @click="goOrderList">
            <img src="@/assets/images/myorder1x.png" srcset="@/assets/images/myorder2x.png 2x" />
            <div class="nav-item-con flex-center">我的订单</div>
          </li>
        </template>
        <template v-if="routeName !== 'userCenter' || (routeName === 'userCenter' && routeParamsOrigin !== 'userInfo')">
          <li class="split"></li>
          <li class="nav-item flex align-center" @click="goUserCenter">
            <img src="@/assets/images/my1x.png" srcset="@/assets/images/my2x.png 2x" />
            <div class="nav-item-con flex-center">个人中心</div>
          </li>
        </template>
        <li class="split"></li>
        <li class="nav-item small jump">
          <div class="nav-item-con flex-center">网站导航</div>
          <div class="jump-dialog">这是网站导航，点哪到哪哦</div>
        </li>
        <li class="split"></li>
        <li class="nav-item small faq">
          <div class="nav-item-con flex-center">FAQ</div>
          <div class="faq-dialog">
            <div class="triangle"></div>
            <div>
              <div>问：可以送个小礼物吗？</div>
              <div class="second-txt">搭：可以的哦亲，随机送款钥匙扣或其他小饰品。</div>
            </div>
          </div>
        </li>
        <li class="split"></li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
const router = useRouter()
let routeName = router.currentRoute.value.name
let routeParamsOrigin = router.currentRoute.value.params.origin

function goHome() {
  router.push({ name: 'home' })
}
function goOrderList() {
  if (routeName === 'userCenter' && routeParamsOrigin === 'orderList') return
  const { href } = router.resolve({
    name: 'userCenter',
    params: {
      origin: 'orderList'
    }
  })
  window.open(href, '_blank')
}
function goUserCenter() {
  if (routeName === 'userCenter' && routeParamsOrigin === 'userInfo') return
  const { href } = router.resolve({
    name: 'userCenter',
    params: {
      origin: 'userInfo'
    }
  })
  window.open(href, '_blank')
}

let token = ref(localStorage['xhhToken'])
function goLogin() {
  router.replace({
    path: '/login'
  })
}
// 退出登录
let exitVisible = ref(false)
function exitLogin() {
  localStorage.removeItem('xhhToken')
  token.value = ''
  if (routeName !== 'home') {
    let fromPage = router.currentRoute.value.fullPath
    // console.log(`/login?pageRedirect=${fromPage}`)
    router.replace(`/login?pageRedirect=${fromPage}`)
  }
}
</script>

<style scoped lang="less">
.site-nav {
  border-bottom: 1px solid @border-line-color;
  font-size: 12px;
  background: @bg-gray-color;
  .site-nav-content {
    height: 36px;
    .nav-left {
      .nav-info {
        margin-right: 25px;
        cursor: pointer;
        .iconfont {
          font-size: 20px;
          margin-right: 3px;
          color: @primary-color;
          &.addr-icon {
            font-size: 19px;
            color: @dark-gray-color;
          }
        }
      }
    }
    .nav-right {
      height: 100%;
      .split {
        width: 1px;
        height: 12px;
        margin: 0 7px;
        background-color: @light-gray-color;
      }
      .nav-item {
        min-width: 70px;
        height: 100%;
        cursor: pointer;
        &.small {
          min-width: 58px;
        }
        > img {
          width: 14px;
          margin: 0 3px;
        }
        .nav-item-con {
          width: 100%;
          height: 100%;
          &.nav-item-con-hover {
            &:hover {
              color: @focus-color;
            }
          }
          .highlight-font {
            font-size: 13px;
            color: @primary-color;
            font-weight: bold;
          }
        }
        .second-txt {
          margin-top: 10px;
        }
      }
      .jump {
        position: relative;
        z-index: 99;
        &:hover {
          background-color: #fff;
          .nav-item-con {
            position: relative;
            z-index: 1;
            background-color: #fff;
            border-left: 1px solid @border-line-color;
            border-right: 1px solid @border-line-color;
          }
          .jump-dialog {
            display: block;
          }
        }
        .jump-dialog {
          display: none;
          position: absolute;
          top: 35px;
          right: 0;
          width: 180px;
          border: 1px solid @border-line-color;
          font-size: 12px;
          padding: 15px 10px;
          text-align: left;
          background-color: #fff;
          &:hover {
            display: block;
          }
        }
      }
      .faq {
        min-width: 35px !important;
        position: relative;
        z-index: 99;
        &:hover {
          .faq-dialog {
            display: block;
          }
        }
        .faq-dialog {
          display: none;
          position: absolute;
          top: 33px;
          left: -68px;
          width: 155px;
          border: 1px solid @border-line-color;
          font-size: 12px;
          padding: 15px 10px;
          border-radius: 10px;
          text-align: left;
          background-color: #fff;
          &:hover {
            display: block;
          }
          .triangle {
            position: absolute;
            top: -6px;
            left: 95px;
            transform: rotate(135deg);
            width: 10px;
            height: 10px;
            background-color: #fff;
            border-left: 1px solid @border-line-color;
            border-bottom: 1px solid @border-line-color;
          }
        }
      }
    }
  }
}
.html-mini {
  .home-page {
    .site-nav {
      .site-nav-content {
        width: @page-s-width;
      }
    }
  }
}
.exit-popover {
  .con {
    font-size: 15px;
    margin: 5px 0 15px;
  }
}
</style>
