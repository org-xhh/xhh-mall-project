<template>
  <div class="userInfo-page min-width-b">
    <SiteNav />

    <CommonHeader />

    <div class="info-part">
      <div class="info-content main-b-width flex space-between">
        <UserMenuBar :activeMenuValue="activeMenuValue" @emitToggleMenuLi="emitToggleMenuLi" />
        <div class="flex1 info-content-wrap">
          <component :is="componentName" />
        </div>
      </div>
    </div>

    <CommonFooter />
  </div>
</template>

<script setup>
import { ref, shallowRef, defineAsyncComponent } from 'vue'
import SiteNav from '@/components/SiteNav'
import CommonHeader from '@/components/CommonHeader'
import CommonFooter from '@/components/CommonFooter'
import UserMenuBar from '@/components/userCenter/UserMenuBar'

import { useRouter } from 'vue-router'
const router = useRouter()

// tab切换动态组件
// Vue received a Component that was made a reactive object. ...... using `shallowRef` instead of `ref`.
let componentName = shallowRef('')
// 高亮tab
let activeMenuValue = ref('')

// 打开页面路由
let routerOrigin = router.currentRoute.value.params.origin
activeMenuValue.value = routerOrigin
const orderListComp = defineAsyncComponent(() => import('./userCenter/orderList.vue'))
const userInfoComp = defineAsyncComponent(() => import('./userCenter/userInfo.vue'))
const addressListComp = defineAsyncComponent(() => import('./userCenter/addressList.vue'))
const couponComp = defineAsyncComponent(() => import('./userCenter/coupon.vue'))
const careGoodsComp = defineAsyncComponent(() => import('./userCenter/careGoods.vue'))
const routerObj = {
  orderList: orderListComp,
  userInfo: userInfoComp,
  addressList: addressListComp,
  coupon: couponComp,
  careGoods: careGoodsComp
}
componentName.value = routerObj[routerOrigin]

// 点击tab，replace页面
function emitToggleMenuLi({ key }) {
  router.replace({
    name: 'userCenter',
    params: {
      origin: key
    }
  })
}
</script>

<style scoped lang="less">
.userInfo-page {
  background: @bg-gray-color;
  .info-part {
    margin: 20px 0;
    .info-content {
      .info-content-wrap {
        padding: 20px;
        background-color: #fff;
        margin-left: 10px;
      }
    }
  }
}
</style>
