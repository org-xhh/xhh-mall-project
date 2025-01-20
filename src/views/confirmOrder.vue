<template>
  <div class="confirm-order-page min-width-b">
    <SiteNav />

    <div class="order-progress-part">
      <div class="order-progress-content main-b-width flex align-center space-around">
        <img src="../assets/images/logo.jpg" class="logo" />
        <div class="step-list-wrap">
          <StepList :stepActiveIndex="stepActiveIndex" />
        </div>
      </div>
    </div>

    <div class="gap"></div>

    <div class="confirm-order-part">
      <div class="confirm-order-content main-b-width">
        <!-- 收货地址 -->
        <div v-if="isAddrMode1" class="address-wrap">
          <div class="common-title">选择收货地址</div>
          <ul class="flex flex-wrap addr-list">
            <li
              v-for="(item, index) in addressList"
              :key="item.id"
              class="addr-li"
              :class="{ 'active': addrActive === index }"
              @click="toggleAddress(index)"
            >
              <div v-if="item.isdefault === 1" class="default-desc">默认地址</div>
              <div class="person-name flex ellipsis1">
                <div class="city-name flex">{{ item.province }}{{ item.city }}</div>
                <div class="name ellipsis1">（{{ item.personName }}收）</div>
              </div>
              <div class="addr-info">{{ item.county }}{{ item.addressDetail }} {{ item.mobile }}</div>
              <div v-if="addrActive === index" class="operate-info">
                <span class="edit-btn">修改</span>
              </div>
              <div v-if="addrActive === index" class="selected-icon">
                <el-icon size="12" color="#fff"><Select /></el-icon>
              </div>
            </li>
          </ul>
          <div class="addr-more flex space-between">
            <div>使用新地址</div>
            <div>管理地址</div>
          </div>
        </div>

        <div v-if="!isAddrMode1" class="address-wrap-new">
          <div class="addr-title flex space-between">
            <div class="tit">选择收货地址</div>
            <div class="add-addr">新增收货地址</div>
          </div>
          <ul class="addr-list">
            <li
              v-for="(item, index) in addressList"
              :key="index"
              class="addr-li flex align-center space-between"
              :class="{ 'active': addrActive === index }"
              @click="toggleAddress(index)"
            >
              <!-- 默认展开2条 -->
              <template v-if="showMoreAddr || (!showMoreAddr && index <= 1)">
                <div class="addr-li-left flex align-center">
                  <div class="consignee flex-center">
                    <span class="ellipsis1">{{ item.personName }}</span
                    >&nbsp;&nbsp;{{ item.province }}

                    <div v-if="addrActive === index" class="selected-icon">
                      <el-icon size="10" color="#fff"><Select /></el-icon>
                    </div>
                  </div>
                  <div class="long-addr">
                    {{ item.personName }}&nbsp;&nbsp;&nbsp;{{ item.province }}{{ item.city }}{{ item.county
                    }}{{ item.addressDetail }}&nbsp;&nbsp;&nbsp;{{ item.mobile }}
                    <span v-if="item.isdefault === 1" class="default-addr">默认地址</span>
                  </div>
                </div>
                <div class="new-edit-btn">编辑</div>
              </template>
            </li>
          </ul>
          <div v-if="addressList.length > 2" class="addr-expand-more flex-center" @click="clickExpandAddr">
            {{ showMoreAddr ? '收起' : '更多地址' }}<el-icon :class="{ 'rotate': showMoreAddr }"><ArrowDown /></el-icon>
          </div>
        </div>

        <!-- 菜鸟驿站 -->
        <div class="station-wrap">
          <div class="common-title">
            菜鸟驿站代收服务<span class="desc-tip">免费</span><el-icon size="18"><QuestionFilled /></el-icon>
          </div>
          <div class="station-info flex align-center">
            <input type="checkbox" v-model="addrStationChecked" />
            <div>[菜鸟驿站]江苏省 徐州市 云龙区 大龙湖街道x-xxx号(电话:19999999999)（珺珺收）16666666666</div>
          </div>
          <div class="station-more">
            <div>修改驿站</div>
          </div>
        </div>

        <!-- 商品信息 -->
        <div class="order-wrap">
          <div class="common-title">确认订单信息</div>

          <div class="cart-list">
            <div class="header-column flex">
              <div class="column column1">商品</div>
              <div class="column column2">规格</div>
              <div class="column column3">单价</div>
              <div class="column column4">数量</div>
              <div class="column column5">小计</div>
            </div>

            <div v-for="(shopItem, shopIndex) in shopCartList" :key="shopIndex" class="shop-item">
              <div class="shop-goods-column">
                <div class="column-shop flex align-center">
                  <img src="@/assets/images/logo.jpg" class="shop-logo" />
                  <div class="ellipsis1">
                    {{ shopItem.shopname }}
                  </div>
                  <div class="seller-name flex align-center">
                    {{ shopItem.seller }}<el-icon color="#1C9EFF" size="17"><ChatDotRound /></el-icon>
                  </div>
                </div>
              </div>
              <div class="goods-column flex align-center" v-for="(item, index) in shopItem.goodsList" :key="index">
                <div class="column column1 flex align-center">
                  <div class="img-info">
                    <img src="../assets/images/img.jpg" @click="goGoodsDetail(item)" />
                  </div>
                  <div class="goods-title">
                    <div class="title ellipsis2" @click="goGoodsDetail(item)">{{ item.title }}</div>
                  </div>
                </div>
                <div class="column column2 ellipsis2">{{ item.priceTitle }}</div>
                <div class="column column3">￥{{ item.price }}/{{ item.unit }}</div>
                <div class="column column4">
                  {{ item.count }}
                </div>
                <div class="column column5">￥{{ item.totalPrice }}</div>
              </div>
              <div class="append-service flex">
                <div class="service-item flex1">
                  <div v-if="shopItem.invoiceObj.canInvoice" class="sub-item">
                    <div class="flex align-center">
                      <input type="checkbox" v-model="shopItem.invoiceObj.checked" />开具发票
                    </div>
                    <ul v-if="shopItem.invoiceObj.checked" class="invoice-ul">
                      <li class="flex align-center">
                        <div class="li-left">发票类型：</div>
                        <div class="li-right">增值税纸质普通发票</div>
                      </li>
                      <li class="flex align-center">
                        <div class="li-left">发票信息：</div>
                        <div class="li-right">
                          <el-select v-model="shopItem.invoiceObj.infoVal" placeholder="发票信息" size="small">
                            <el-option
                              v-for="item in invoiceInfoOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </div>
                      </li>
                      <li class="flex align-center">
                        <div class="li-left">发票抬头类型：</div>
                        <div class="li-right">
                          <el-radio-group v-model="shopItem.invoiceObj.type">
                            <el-radio label="1" size="small">个人</el-radio>
                            <el-radio label="2" size="small">企业</el-radio>
                          </el-radio-group>
                        </div>
                      </li>
                      <li class="flex align-center">
                        <div class="li-left">发票抬头：</div>
                        <div class="li-right">
                          <template v-if="shopItem.invoiceObj.invoiceTitle && shopItem.invoiceObj.titleShow">
                            <span>{{ shopItem.invoiceObj.invoiceTitle }}</span>
                            <span class="edit-btn" @click="editInvoiceInfo(shopItem.invoiceObj, 'titleShow')"
                              >修改</span
                            >
                          </template>
                          <template v-else>
                            <el-input
                              v-model="shopItem.invoiceObj.invoiceTitle"
                              size="small"
                              v-focus
                              placeholder="发票抬头"
                              @blur="blurInvoiceInfo(shopItem.invoiceObj, 'titleShow', 'invoiceTitle')"
                            />
                          </template>
                        </div>
                      </li>
                      <li v-if="shopItem.invoiceObj.type === '2'" class="flex align-start">
                        <div class="li-left">纳税人识别号：</div>
                        <div class="li-right">
                          <template v-if="shopItem.invoiceObj.taxcode && shopItem.invoiceObj.taxcodeShow">
                            <span>{{ shopItem.invoiceObj.taxcode }}</span>
                            <span class="edit-btn" @click="editInvoiceInfo(shopItem.invoiceObj, 'taxcodeShow')"
                              >修改</span
                            >
                          </template>
                          <template v-else>
                            <el-input
                              v-model="shopItem.invoiceObj.taxcode"
                              size="small"
                              v-focus
                              style="width: 300px"
                              placeholder="根据最新增值税管理办法，如需企业抬头发票，请填写有效税号信息。"
                              @blur="blurInvoiceInfo(shopItem.invoiceObj, 'taxcodeShow', 'taxcode')"
                            />
                            <div v-if="!shopItem.invoiceObj.taxcode" class="taxcode-tip">
                              <el-icon style="vertical-align: -1px"><CircleCloseFilled /></el-icon>
                              根据最新增值税管理办法，如需企业抬头发票，请填写有效税号信息。
                              <div class="triangle"></div>
                            </div>
                          </template>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div class="sub-item flex">
                    <div>
                      <div class="tit">给卖家留言：</div>
                      <el-tooltip v-if="shopItem.showMessageTip" effect="light" placement="bottom">
                        <template #content
                          ><el-icon size="14" style="vertical-align: -2px"><WarningFilled /></el-icon
                          >此处所填内容仅限对商家的提醒，若您需改变订单内容或另有特殊需求，<br />请您务必与商家确认一致。否则该填写兼容将视为无效。</template
                        >
                        <div class="red-tip">重要提醒</div>
                      </el-tooltip>
                    </div>

                    <el-input
                      type="textarea"
                      :rows="shopItem.showMessageTip ? 3 : 2"
                      maxlength="200"
                      show-word-limit
                      v-model="shopItem.msg"
                      placeholder="选填，请先和商家协商一致，付款后商家可见"
                      @focus="messageFocus(shopItem)"
                      @blur="messageBlur(shopItem)"
                    />
                  </div>
                </div>
                <div class="service-item flex1">
                  <div class="sub-item flex space-between">
                    <div><span class="tit">运送方式：</span>普通快递</div>
                    <div class="price-con">￥{{ shopItem.shipFee }}</div>
                  </div>
                  <div class="sub-item flex align-center space-between">
                    <div class="flex align-center">
                      <span class="tit">运费险：</span>
                      <input type="checkbox" v-model="shopItem.shipInsuranceChecked" />
                      <span class="ship-insurance-name">运费险</span>
                      {{ parseInt(shopItem.shipInsuranceFee) === 0 ? '卖家赠送，' : '' }}退换货可赔
                    </div>
                    <div class="price-con" :class="{ 'default-color': shopItem.shipInsuranceFee > 0 }">
                      ￥{{ shopItem.shipInsuranceFee }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="shop-total-price">
                <span>
                  <span>店铺合计（含运费）</span>
                  <span class="shop-price">￥66.00</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="more-set flex justify-end">
          <span class="flex align-center"> <input type="checkbox" :checked="true" />匿名购买</span>
          <span class="flex align-center">
            <input type="checkbox" :checked="true" />号码保护（隐藏收件人真实手机号，保护隐私）</span
          >
        </div>

        <div class="order-foot flex align-end direction-column">
          <div>应付总额：<span class="pay">￥888.00</span></div>
          <div class="addr-p">
            寄送至：{{ addressList[addrActive].province }}{{ addressList[addrActive].city
            }}{{ addressList[addrActive].county }}{{ addressList[addrActive].addressDetail }}
            <span class="receive-person"
              >收货人：{{ addressList[addrActive].personName }} {{ addressList[addrActive].mobile }}</span
            >
          </div>
        </div>

        <div class="submit-btn-wrap">
          <button class="submit-btn" @click="goOrderPayment">提交订单</button>
        </div>
      </div>
    </div>

    <CommonFooter />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import SiteNav from '@/components/SiteNav'
import CommonFooter from '@/components/CommonFooter'
import StepList from '@/components/StepList'

import { useRouter } from 'vue-router'
const router = useRouter()

let stepActiveIndex = ref(0)

// 收货地址
let isAddrMode1 = ref(false)
let addrActive = ref(0)
let addressList = reactive([
  {
    id: 1,
    personName: '谢谢',
    mobile: '16****6666',
    province: '江苏省',
    city: '徐州市',
    county: '云龙区',
    addressDetail: '丽水路',
    isdefault: 1
  },
  {
    id: 2,
    personName: '谢谢谢谢谢谢谢谢谢谢谢谢谢谢',
    mobile: '166****8888',
    province: '江苏省',
    city: '徐州市',
    county: '沛县',
    addressDetail: '丽水路丽水路丽水路丽水路丽水路丽水路丽水路1号',
    isdefault: 0
  },
  {
    id: 3,
    personName: '珺珺',
    mobile: '166****8888',
    province: '江苏省',
    city: '徐州市',
    county: '沛县',
    addressDetail: '丽水路丽水路丽水路丽水路丽水路丽水路丽水路1号',
    isdefault: 0
  }
])
// 展开更多地址
let showMoreAddr = ref(false)
function clickExpandAddr() {
  showMoreAddr.value = !showMoreAddr.value
}
function toggleAddress(index) {
  if (addrActive.value === index) return
  addrActive.value = index
}
// 菜鸟驿站
let addrStationChecked = ref(false)
// 商品信息
let shopCartList = reactive([
  {
    shopid: 1,
    shopname: '我的店铺',
    seller: 'xhh',
    invoiceObj: {
      canInvoice: false
    },
    showMessageTip: false,
    shipFee: '0.00',
    shipInsuranceFee: '0.00',
    msg: '',
    goodsList: [
      {
        id: 11,
        title: '商品名称商品名称商品名称商品名称商品名称商品名称名称商品名称商品名称666',
        count: 11,
        price: 5,
        unit: '个',
        totalPrice: '55.00',
        priceTitle: '这是规格'
      },
      {
        id: 22,
        title: '商品名称',
        count: 7,
        price: 1,
        unit: '件',
        totalPrice: '7.00',
        priceTitle: '这是规格这是规格这是规格这是规格这是规格这是规格这是规格这是规格'
      }
    ]
  },
  {
    shopid: 2,
    shopname: '另一个店铺啦',
    seller: '我是卖家联系我吧',
    invoiceObj: {
      canInvoice: true,
      checked: false,
      infoVal: 1,
      type: '1',
      invoiceTitle: '这是发票抬头',
      titleShow: true,
      taxcode: '',
      taxcodeShow: false
    },
    showMessageTip: false,
    shipFee: '0.00',
    shipInsuranceFee: '2.90',
    msg: '',
    goodsList: [
      {
        id: 33,
        title: '商品名称商品名称商品名称商品名称商品名称商品名称名称商品名称商品名称比较长的666',
        count: 9,
        price: 79,
        unit: 't',
        totalPrice: '711.00',
        priceTitle: 'X-rrg005 K-TT6X-rrg005 K-TT6X-rrg005 K-TT6X-rrg005 K-TT6X-rrg005 K-TT6X-rrg005 K-TT6'
      }
    ]
  }
])
function goGoodsDetail(item) {
  const { href } = router.resolve({
    name: 'goodsDetail',
    query: {
      id: item.id
    }
  })
  window.open(href, '_blank')
}
// 给商家留言重要提醒
function messageFocus(shopItem) {
  shopItem.showMessageTip = true
}
function messageBlur(shopItem) {
  shopItem.showMessageTip = false
}
// 开具发票
let invoiceInfoOptions = reactive([
  {
    value: 1,
    label: '明细'
  }
])
function editInvoiceInfo(invoiceObj, attr) {
  invoiceObj[attr] = false
}
function blurInvoiceInfo(invoiceObj, attr, value) {
  if (invoiceObj[value]) {
    invoiceObj[attr] = true
  } else {
    invoiceObj[attr] = false
  }
}
const vFocus = {
  mounted: (el) => {
    // el.focus() // 对原生input有效
    el.children[0].children[0].focus()
  }
}
// 跳订单支付
function goOrderPayment() {
  router.replace({
    name: 'orderPayment'
  })
}
</script>

<style scoped lang="less">
.confirm-order-page {
  background: #fff;
  .gap {
    width: 100%;
    height: 10px;
    background-color: @bg-gray-color;
  }
  .order-progress-part {
    background: #fff;
    .order-progress-content {
      height: 150px;
      .logo {
        width: 120px;
      }
      .step-list-wrap {
        width: 700px;
      }
    }
  }
  .common-title {
    font-size: 15px;
    font-weight: bold;
    margin: 15px 0 8px;
    .desc-tip {
      font-size: 12px;
      background-color: @danger-color;
      color: #fff;
      padding: 0 3px 1px;
      margin: 0 5px;
      border-radius: 2px;
    }
  }
  .confirm-order-part {
    padding-bottom: 20px;
    background: #fff;
    .confirm-order-content {
      .address-wrap {
        .addr-list {
          .addr-li {
            position: relative;
            width: 237px;
            height: 106px;
            margin-right: 14px;
            margin-bottom: 14px;
            cursor: pointer;
            padding: 0 14px 14px 14px;
            background: url('../assets/images/addr_bg.avif') no-repeat; /*  Firefox 68 显示不出来 */
            &.active {
              background: url('@/assets/images/addr_selected.jpg') no-repeat;
            }
            .default-desc {
              position: absolute;
              top: 0;
              right: 0;
              color: #fff;
              font-size: 12px;
              padding: 1px 3px;
              background: #ccc;
              opacity: 0.7;
            }
            .person-name {
              padding: 8px 0 2px;
              border-bottom: 1px solid @border-line-color;
              font-size: 14px;
              font-weight: bold;
            }
            .addr-info {
              height: 41px;
              overflow: hidden;
              padding-top: 5px;
              font-size: 12px;
              /* word-break: break-word; */
              word-break: break-all;
            }
            .operate-info {
              margin-top: 2px;
              .edit-btn {
                font-size: 12px;
                color: @edit-btn-color;
                &:hover {
                  color: @focus-color;
                }
              }
            }
            .selected-icon {
              position: absolute;
              right: 0;
              bottom: 0;
              width: 0;
              height: 0;
              border-top: 13px solid transparent;
              border-bottom: 13px solid @danger-color;
              border-left: 13px solid transparent;
              border-right: 13px solid @danger-color;
              .el-icon {
                position: absolute;
                bottom: -11px;
                right: -11px;
              }
            }
          }
        }
        .addr-more {
          margin-top: 5px;
          font-size: 12px;
          > div {
            color: @edit-btn-color;
            cursor: pointer;
            &:first-child {
              padding: 1px 6px;
              border-radius: 4px;
              border: 1px solid @edit-btn-color;
              &:hover {
                border: 1px solid @primary-color;
              }
            }
            &:hover {
              color: @primary-color;
            }
          }
        }
      }
      .address-wrap-new {
        margin-top: 28px;
        font-size: 12px;
        border: 1px solid @border-line-color;
        padding: 0 10px 10px;
        .addr-title {
          margin: 15px 0 12px;
          .tit {
            font-size: 15px;
            font-weight: bold;
          }
          .add-addr {
            color: @edit-btn-color;
            cursor: pointer;
            &:hover {
              color: @primary-color;
            }
          }
        }
        .addr-list {
          .addr-li {
            padding-right: 10px;
            margin-bottom: 10px;
            cursor: pointer;
            &:hover {
              .consignee {
                background-color: #fff;
              }
              background-color: @light-gray-color;
              .new-edit-btn {
                display: block;
              }
            }
            &.active {
              .addr-li-left {
                .consignee {
                  border: 2px solid @focus-color;
                }
              }
            }
            .addr-li-left {
              .consignee {
                position: relative;
                width: 140px;
                height: 30px;
                margin-right: 10px;
                border: 2px solid @gray-font-color;
                > span {
                  display: inline-block;
                  max-width: 80px;
                }
                .selected-icon {
                  position: absolute;
                  right: 0;
                  bottom: 0;
                  width: 0;
                  height: 0;
                  border-top: 8px solid transparent;
                  border-bottom: 8px solid @danger-color;
                  border-left: 8px solid transparent;
                  border-right: 8px solid @danger-color;
                  .el-icon {
                    position: absolute;
                    bottom: -9px;
                    right: -9px;
                  }
                }
              }
              .default-addr {
                padding: 2px 4px;
                background-color: @light-gray-color;
                margin-left: 8px;
                border-radius: 4px;
              }
              .long-addr {
                max-width: 960px;
              }
            }
            .new-edit-btn {
              display: none;
              color: @edit-btn-color;
              cursor: pointer;
              &:hover {
                color: @primary-color;
              }
            }
          }
        }
        .addr-expand-more {
          height: 40px;
          cursor: pointer;
          .el-icon {
            margin-left: 5px;
            transition: 0.1s;
            &.rotate {
              transform: rotate(180deg);
            }
          }
        }
      }
      .station-wrap {
        margin-top: 28px;
        font-size: 12px;
        border: 1px solid @border-line-color;
        padding: 0 10px 10px;
        .common-title {
          margin-top: 10px;
          margin-bottom: 15px;
          .el-icon {
            vertical-align: middle;
            cursor: pointer;
          }
        }
        .station-info {
          input[type='checkbox'] {
            width: 16px;
            height: 16px;
            margin-right: 10px;
            cursor: pointer;
          }
        }
        .station-more {
          margin-top: 12px;
          padding-left: 25px;
          > div {
            color: @edit-btn-color;
            cursor: pointer;
            &:hover {
              color: @primary-color;
            }
          }
        }
      }
      .order-wrap {
        margin-top: 35px;
        .cart-list {
          font-size: 14px;
          .column {
            text-align: center;
            &.column1 {
              flex: 1;
              text-align: left;
              padding: 0 25px 0 12px;
            }
            &.column2 {
              width: 200px;
              text-align: left;
            }
            &.column3 {
              width: 140px;
            }
            &.column4 {
              width: 120px;
            }
            &.column5 {
              width: 150px;
            }
          }
          .header-column {
            border-bottom: 3px solid @primary-color;
            padding-bottom: 2px;
            margin-top: 15px;
          }
          .shop-item {
            margin-bottom: 5px;
          }
          .shop-goods-column {
            padding: 15px 0 0 0;
            .column-shop {
              width: 100%;
              text-align: left;
              overflow: hidden;
              padding-bottom: 5px;
              border-bottom: 1px dashed @primary-light-color;
              .shop-logo {
                width: 18px;
                height: 18px;
                margin-right: 3px;
              }
              .seller-name {
                margin-left: 60px;
                .el-icon {
                  margin-left: 6px;
                  cursor: pointer;
                }
              }
            }
          }
          .goods-column {
            padding: 15px 0;
            border-bottom: 1px dashed @border-line-color;
            &:last-child {
              border-bottom: none;
            }
            .column1 {
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
            .column2 {
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
              }
            }
            .column5 {
              padding-right: 10px;
              text-align: right;
              font-weight: bold;
              color: @danger-color;
            }
          }
          .append-service {
            font-size: 12px;
            background-color: @bg-gray-color;
            .service-item {
              &:first-child {
                .sub-item {
                  border-right: 1px solid #fff;
                }
              }
              .sub-item {
                padding: 10px;
                border-top: 1px solid #fff;
                .tit {
                  display: inline-block;
                  min-width: 72px;
                  text-align: right;
                  margin-right: 2px;
                }
                input[type='checkbox'] {
                  width: 16px;
                  height: 16px;
                  margin-right: 5px;
                  cursor: pointer;
                }
                .el-textarea {
                  width: 360px;
                  font-size: 12px;
                }
                .red-tip {
                  cursor: pointer;
                  color: @danger-color;
                }
                .ship-insurance-name {
                  font-size: 12px;
                  background-color: @primary-color;
                  color: #fff;
                  padding: 0 3px 1px;
                  margin-right: 2px;
                  border-radius: 2px;
                }
                .price-con {
                  color: @danger-color;
                  font-weight: bold;
                  &.default-color {
                    color: inherit;
                  }
                }
                .invoice-ul {
                  margin-top: 8px;
                  padding-bottom: 10px;
                  > li {
                    margin-top: 6px;
                    min-height: 24px;
                    .li-left {
                      min-width: 90px;
                    }
                    .li-right {
                      .edit-btn {
                        margin-left: 10px;
                        font-size: 12px;
                        color: @edit-btn-color;
                        cursor: pointer;
                        &:hover {
                          color: @focus-color;
                        }
                      }
                      .taxcode-tip {
                        position: relative;
                        width: 300px;
                        border-radius: 4px;
                        margin-top: 5px;
                        padding: 1px 4px;
                        background: @danger-light-color;
                        border: 1px solid @focus-color;
                        color: @focus-color;
                        .triangle {
                          position: absolute;
                          top: -4px;
                          left: 20px;
                          transform: rotate(135deg);
                          width: 6px;
                          height: 6px;
                          background-color: @danger-light-color;
                          border-left: 1px solid @focus-color;
                          border-bottom: 1px solid @focus-color;
                        }
                      }
                      .el-select {
                        width: 120px;
                      }
                    }
                  }
                }
              }
            }
          }
          .shop-total-price {
            text-align: right;
            padding: 10px;
            background-color: @bg-gray-color;
            border-top: 1px solid #fff;
            .shop-price {
              color: @danger-color;
              font-weight: bold;
              margin-left: 10px;
            }
          }
        }
      }
      .more-set {
        font-size: 12px;
        height: 48px;
        line-height: 48px;
        padding-right: 10px;
        border-top: 1px dashed @border-line-color;
        border-bottom: 1px dashed @border-line-color;
        > span {
          &:not(:first-child) {
            margin-left: 50px;
          }
          input[type='checkbox'] {
            margin-right: 4px;
          }
        }
      }
      .order-foot {
        margin-top: 15px;
        padding: 15px 10px 16px;
        background-color: @bg-gray-color;
        .pay {
          display: inline-block;
          min-width: 90px;
          font-size: 18px;
          font-weight: 700;
          color: @danger-color;
          text-align: right;
        }
        .addr-p {
          margin-top: 5px;
          font-size: 12px;
          color: @gray-font-color;
          .receive-person {
            margin-left: 20px;
          }
        }
      }
      .submit-btn-wrap {
        text-align: right;
        margin-top: 10px;
        .submit-btn {
          width: 135px;
          height: 36px;
          line-height: 36px;
          margin-right: 10px;
          padding: 0;
          background-color: @danger-color;
          color: #fff;
          font-weight: 700;
          font-size: 16px;
          font-family: arial, 'Microsoft YaHei';
          border-radius: 3px;
          cursor: pointer;
          border: 0;
          &:hover {
            background-color: @focus-color;
          }
        }
      }
    }
  }
}
</style>
