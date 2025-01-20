<template>
  <div class="user-menu-bar">
    <MenuBar :menuObj="obj1" :activeMenuValue="activeMenuValue" @emitToggleMenuLi="emitToggleMenuLi" />

    <MenuBar :menuObj="obj2" :activeMenuValue="activeMenuValue" @emitToggleMenuLi="emitToggleMenuLi" />

    <MenuBar :menuObj="obj3" :activeMenuValue="activeMenuValue" @emitToggleMenuLi="emitToggleMenuLi" />

    <MenuBar :menuObj="obj4" :activeMenuValue="activeMenuValue" @emitToggleMenuLi="emitToggleMenuLi" />

    <MenuBar :menuObj="obj5" :activeMenuValue="activeMenuValue" @emitToggleMenuLi="emitToggleMenuLi" />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import MenuBar from './MenuBar'

const props = defineProps({
  activeMenuValue: String
})

let obj1 = reactive({
  tit: '订单中心',
  list: [
    {
      key: 'orderList',
      title: '我的订单'
    }
  ]
})
let obj2 = reactive({
  tit: '设置',
  list: [
    {
      key: 'userInfo',
      title: '个人中心'
    },
    {
      key: 'addressList',
      title: '收货地址'
    }
  ]
})
let obj3 = reactive({
  tit: '关注中心',
  list: [
    {
      key: 'careGoods',
      title: '关注的商品'
    },
    {
      key: 'key2',
      title: '关注的店铺'
    }
  ]
})
let obj4 = reactive({
  tit: '资产中心',
  list: [
    {
      key: 'key3',
      title: '小金库'
    },
    {
      key: 'key4',
      title: '余额'
    },
    {
      key: 'key5',
      title: '红包'
    },
    {
      key: 'key6',
      title: '银行卡'
    },
    {
      key: 'coupon',
      title: '优惠券'
    }
  ]
})
let obj5 = reactive({
  tit: '客户服务',
  list: [
    {
      key: 'key7',
      title: '返修退换货'
    },
    {
      key: 'key8',
      title: '价格保护'
    },
    {
      key: 'key9',
      title: '意见建议'
    },
    {
      key: 'key10',
      title: '我的问答'
    },
    {
      key: 'key11',
      title: '购买咨询'
    },
    {
      key: 'key12',
      title: '交易纠纷'
    },
    {
      key: 'key13',
      title: '我的发票'
    },
    {
      key: 'key14',
      title: '举报中心'
    }
  ]
})

// 页面标题
let objList = [obj1, obj2, obj3, obj4, obj5]
foo: for (let i = 0; i < objList.length; i++) {
  let valueItem = objList[i]
  let perList = valueItem.list || []
  // console.log('第一层')
  for (let j = 0; j < perList.length; j++) {
    // console.log('第二层', props.activeMenuValue === perList[j].key)
    if (props.activeMenuValue === perList[j].key) {
      document.title = perList[j].title
      break foo // 跳出双循环
    }
  }
}

const emitEvent = defineEmits(['emitToggleMenuLi'])
function emitToggleMenuLi(item) {
  if (props.activeMenuValue === item.key) return
  emitEvent('emitToggleMenuLi', item)
}
</script>

<style scoped lang="less">
.user-menu-bar {
  padding-left: 10px;
  width: 100px;
}
</style>
