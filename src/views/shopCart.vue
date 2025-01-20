<template>
  <div class="shop-cart-page min-width-b">
    <SiteNav />

    <CommonHeader />

    <div class="gap"></div>

    <div class="cart-part">
      <div class="cart-content main-b-width">
        <div class="all-goods flex space-between">
          <div class="all-goods-tit">全部商品(12)</div>
        </div>

        <div class="cart-list">
          <div class="header-column flex">
            <div class="column column1">
              <input type="checkbox" :checked="allChecked" @click="clickAllChecked" />全选
            </div>
            <div class="column column2">商品</div>
            <div class="column column3">单价</div>
            <div class="column column4">数量</div>
            <div class="column column5">小计</div>
            <div class="column column6">操作</div>
          </div>

          <div v-for="(shopItem, shopIndex) in shopCartList" :key="shopIndex" class="shop-item">
            <div class="goods-column flex align-center">
              <div class="column column-shop flex align-center">
                <input type="checkbox" :checked="shopItem.checked" @click="clickShopChecked(shopItem)" />
                <div class="shop-name ellipsis1">{{ shopItem.shopname }}</div>
              </div>
            </div>
            <div
              class="goods-column flex align-center"
              v-for="(item, index) in shopItem.goodsList"
              :key="index"
              :class="{ 'no-border-top': index >= 0 }"
            >
              <div class="column column1">
                <input type="checkbox" :checked="item.checked" @click="clickGoodsChecked(item, shopItem)" />
              </div>
              <div class="column column2 flex">
                <div class="img-info">
                  <img src="../assets/images/img.jpg" @click="goGoodsDetail(item)" />
                </div>
                <div class="goods-title">
                  <div class="title ellipsis2" @click="goGoodsDetail(item)">{{ item.title }}</div>
                  <div class="sku-info">这是规格</div>
                </div>
              </div>
              <div class="column column3">￥{{ item.price }}/{{ item.unit }}</div>
              <div class="column column4 flex-center">
                <div class="number-counter flex">
                  <div
                    class="counter counter-minus flex-center"
                    :class="{ 'disabled': item.count <= 1 }"
                    @click="item.count <= 1 ? '' : clickCounterMinus(item)"
                  >
                    -
                  </div>
                  <input
                    type="text"
                    :value="item.count"
                    @blur="
                      (event) => {
                        return counterInputBlur(item, event)
                      }
                    "
                  />
                  <div
                    class="counter counter-add flex-center"
                    :class="{ 'disabled': item.count >= maxCounter }"
                    @click="item.count >= maxCounter ? '' : clickCounterAdd(item)"
                  >
                    +
                  </div>
                </div>
              </div>
              <div class="column column5">￥{{ perGoodsTotalPrice(item) }}</div>
              <div class="column column6 flex justify-center"><div>删除</div></div>
            </div>
          </div>

          <div class="toolbar-column flex space-between">
            <div class="toolbar-left flex align-center">
              <div class="all-select-btn flex align-center">
                <input type="checkbox" :checked="allChecked" @click="clickAllChecked" />全选
              </div>

              <div class="operate-btn flex">
                <div>导出选中商品</div>
                <div>删除选中商品</div>
                <div>清空购物车</div>
              </div>
            </div>

            <div class="toolbar-right flex align-center">
              <div class="select-count">
                已选择<span>{{ totalPriceObj.buyCount || 0 }}</span
                >件商品<el-icon><ArrowUp /></el-icon>
              </div>
              <div class="sum">
                总价：<span>￥{{ totalPriceObj.totalPrice || '0.00' }}</span
                ><el-icon size="18"><InfoFilled /></el-icon>
              </div>
              <div class="settle-btn flex-center" @click="goConfirmOrder">去结算</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CommonFooter />

    <ToolBar />
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import SiteNav from '@/components/SiteNav'
import CommonHeader from '@/components/CommonHeader'
import CommonFooter from '@/components/CommonFooter'
import ToolBar from '@/components/ToolBar'
import { numberMul, twoDecimalfn } from '@web-xhh/web-utils'

import { useRouter } from 'vue-router'
const router = useRouter()

let shopCartList = reactive([
  {
    shopid: 1,
    shopname: '我的店铺',
    goodsList: [
      {
        id: 11,
        title: '商品名称商品名称商品名称商品名称商品名称商品名称名称商品名称商品名称666',
        count: 11,
        price: 5,
        unit: '个'
      },
      {
        id: 22,
        title: '商品名称',
        count: 7,
        price: 25016,
        unit: '件'
      }
    ]
  },
  {
    shopid: 2,
    shopname: '我的店铺我的店铺我的店铺我的店铺我的店铺我的店铺我的店铺我的店铺我的店铺我的店铺我的店铺',
    goodsList: [
      {
        id: 33,
        title: '商品名称商品名称商品名称商品名称商品名称商品名称名称商品名称商品名称666',
        count: 9,
        price: 79,
        unit: 't'
      },
      {
        id: 44,
        title: '商品名称',
        count: 7,
        price: 19.9,
        unit: '斤'
      }
    ]
  }
])
// 商品数量*单价
const perGoodsTotalPrice = computed(() => {
  return function (item) {
    // return item.count * item.price
    return twoDecimalfn(numberMul(item.count, item.price))
  }
})
// 更改商品数量
let maxCounter = 20
function clickCounterMinus(item) {
  item.count--
}
function clickCounterAdd(item) {
  item.count++
}
function counterInputBlur(item, event) {
  let target = event.target || event.srcElement
  let inputValue = target.value
  if (inputValue > maxCounter) {
    // 20改为200，不然页面上不生效
    item.count = 0
    item.count = maxCounter
  } else if (inputValue <= 0) {
    item.count = 1
  } else {
    item.count = inputValue
  }

  // target.dispatchEvent(new Event('input'))
  // console.log('item.count:', item.count)
}
// 是否全选
let allChecked = ref(false)
function judgeIsAllChecked() {
  let isChecked = true
  for (let i = 0; i < shopCartList.length; i++) {
    for (let j = 0; j < shopCartList[i].goodsList.length; j++) {
      if (!shopCartList[i].goodsList[j].checked) {
        isChecked = false
        break
      }
    }
  }
  allChecked.value = isChecked
}
// 店铺是否全选
function judgeIsShopChecked(shopItem) {
  let isChecked = true
  for (let i = 0; i < shopItem.goodsList.length; i++) {
    if (!shopItem.goodsList[i].checked) {
      isChecked = false
      break
    }
  }
  shopItem.checked = isChecked
}
// 全选/取消全选
function clickAllChecked() {
  allChecked.value = !allChecked.value
  if (allChecked.value) {
    shopCartList.map((shopItem) => {
      shopItem.checked = true
      shopItem.goodsList.map((subItem) => {
        subItem.checked = true
      })
    })
  } else {
    shopCartList.map((shopItem) => {
      shopItem.checked = false
      shopItem.goodsList.map((subItem) => {
        subItem.checked = false
      })
    })
  }
}
// 店铺 全选/取消全选
function clickShopChecked(shopItem) {
  shopItem.checked = !shopItem.checked
  if (shopItem.checked) {
    shopItem.goodsList.map((subItem) => {
      subItem.checked = true
    })
  } else {
    shopItem.goodsList.map((subItem) => {
      subItem.checked = false
    })
  }
  // 是否全选
  judgeIsAllChecked()
}
// 商品 选择/取消选择
function clickGoodsChecked(item, shopItem) {
  item.checked = !item.checked

  // 是否全选
  judgeIsAllChecked()

  // 店铺是否全选
  judgeIsShopChecked(shopItem)
}
// 计算共选多少商品、总价
const totalPriceObj = computed(() => {
  let buyCount = 0
  let totalPrice = 0
  shopCartList.forEach((shopItem) => {
    shopItem.goodsList.forEach((subItem) => {
      if (subItem.checked) {
        buyCount++
        totalPrice += parseFloat(twoDecimalfn(numberMul(subItem.count, subItem.price)))
      }
    })
  })
  return {
    buyCount,
    totalPrice: twoDecimalfn(totalPrice)
  }
})

// 跳转带参数
function goGoodsDetail(item) {
  const { href } = router.resolve({
    name: 'goodsDetail',
    query: {
      id: item.id
    }
  })
  window.open(href, '_blank')
}
// 跳确认订单
function goConfirmOrder() {
  router.replace({
    name: 'confirmOrder'
  })
}
</script>

<style scoped lang="less">
.shop-cart-page {
  background: #fff;
  .gap {
    width: 100%;
    height: 10px;
    background-color: @bg-gray-color;
  }
  .cart-part {
    background: #fff;
    padding-bottom: 20px;
    .cart-content {
      padding-top: 15px;
      .all-goods {
        margin-bottom: 16px;
        .all-goods-tit {
          font-size: 18px;
          color: @primary-color;
          font-weight: 600;
        }
      }
      .cart-list {
        font-size: 14px;
        input[type='checkbox'] {
          position: relative;
          width: 15px;
          height: 15px;
          cursor: pointer;
        }
        input[type='checkbox']::after {
          position: absolute;
          top: 0;
          width: 15px;
          height: 15px;
          line-height: 15px;
          text-align: center;
        }
        input[type='checkbox']:checked::after {
          content: '✓';
          color: #fff;
          background-color: @primary-color;
        }
        .column {
          text-align: center;
          &.column2 {
            text-align: left;
          }
          &.column3 {
            width: 140px;
          }
          &.column4 {
            width: 200px;
          }
          &.column5 {
            width: 160px;
          }
          &.column6 {
            width: 120px;
          }
        }
        .header-column {
          height: 46px;
          line-height: 46px;
          background-color: @bg-gray-color;
          margin-bottom: 20px;
          .column {
            &.column1 {
              width: 140px;
              padding-left: 18px;
              text-align: left;
              input {
                margin-right: 5px;
                vertical-align: middle;
                margin-top: -1px;
              }
            }
            &.column2 {
              width: 430px;
            }
          }
        }
        .shop-item {
          margin-bottom: 20px;
        }
        .goods-column {
          padding: 15px 0;
          border: 1px solid @border-line-color;
          .column-shop {
            max-width: 300px;
            padding-left: 18px;
            text-align: left;
            overflow: hidden;
            input {
              margin-right: 5px;
            }
          }
          &.no-border-top {
            border-top: none;
          }
          .column1 {
            width: 51px;
          }
          .column2 {
            width: 518px;
            .img-info {
              margin-right: 10px;
              width: 80px;
              height: 80px;
              border-radius: 2px;
              img {
                width: 80px;
                height: 80px;
                border-radius: 2px;
                cursor: pointer;
              }
            }
            .goods-title {
              .title {
                font-weight: bold;
                cursor: pointer;
                &:hover {
                  color: @primary-color;
                }
              }
              .sku-info {
                margin-top: 10px;
                color: @gray-font-color;
              }
            }
          }
          .column3 {
            color: @danger-color;
          }
          .column4 {
            .number-counter {
              width: 120px;
              height: 32px;
              .counter {
                width: 30px;
                height: 100%;
                background-color: @bg-gray-color;
                border: 1px solid @border-line-color;
                cursor: pointer;
                &.disabled {
                  color: @gray-font-color;
                  cursor: not-allowed;
                }
              }
              input {
                width: 60px;
                height: 100%;
                border: none;
                text-align: center;
                border-top: 1px solid @border-line-color;
                border-bottom: 1px solid @border-line-color;
                &:focus {
                  border: none;
                  outline: none;
                  border-top: 1px solid @border-line-color;
                  border-bottom: 1px solid @border-line-color;
                }
              }
            }
          }
          .column5 {
            color: @danger-color;
          }
          .column6 {
            > div {
              cursor: pointer;
              &:hover {
                color: @danger-color;
              }
            }
          }
        }
        .toolbar-column {
          border: 1px solid @border-line-color;
          .toolbar-left {
            padding: 15px 0;
            .all-select-btn {
              padding-left: 18px;
              input {
                margin-right: 5px;
              }
            }
            .operate-btn {
              > div {
                margin-left: 15px;
                cursor: pointer;
                &:first-child {
                  &:hover {
                    color: @primary-color;
                  }
                }
                &:hover {
                  color: @danger-color;
                }
              }
            }
          }
          .toolbar-right {
            .select-count {
              margin-top: 3px;
              span {
                margin: 0 3px;
                color: @danger-color;
              }
              .el-icon {
                vertical-align: -1px;
              }
            }
            .sum {
              margin: 0 15px 0 25px;
              color: @gray-font-color;
              span {
                font-size: 18px;
                color: @danger-color;
              }
              .el-icon {
                vertical-align: -3px;
                margin-left: 3px;
                color: @warning-color;
                cursor: pointer;
              }
            }
            .settle-btn {
              width: 100px;
              height: 100%;
              color: #fff;
              font-size: 18px;
              cursor: pointer;
              background-color: @danger-color;
            }
          }
        }
      }
    }
  }
}
</style>
