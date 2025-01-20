<template>
  <div class="order-payment-page min-width-b">
    <SiteNav />

    <div class="order-progress-part">
      <div class="order-progress-content main-b-width flex align-center space-around">
        <img src="../assets/images/logo.jpg" class="logo" />
        <div class="step-list-wrap">
          <StepList :stepActiveIndex="stepActiveIndex" />
        </div>
      </div>
    </div>

    <div class="order-part">
      <div class="order-content main-b-width">
        <div class="order-wrap">
          <div class="base-info flex space-between align-end">
            <div class="info-left">
              <div class="tit">订单提交成功，请尽快付款！</div>
              <div v-if="!timeOver" v-matchKeyword:[timeDesc]>{{ timeDesc }}</div>
              <div v-else>超时未付款，订单已取消。</div>
            </div>
            <div class="info-right">
              <div class="prices">￥<span class="price">666.00</span></div>
              <div class="detail-btn" @click="toggleGoodsDetail">
                查看订单详情
                <el-icon v-if="!showGoodsInfo"><CaretBottom /></el-icon>
                <el-icon v-else><CaretTop /></el-icon>
              </div>
            </div>
          </div>
          <div class="goods-info" :class="{ 'hide': !showGoodsInfo }" ref="goodsInfoRef">
            <div class="goods-info-inner">
              <br /><br />这是商品信息<br /><br />
              <br /><br /><br /><br />
              <br /><br /><br /><br />
            </div>
          </div>
        </div>

        <div class="pay-wrap">
          <div class="pay-header">选择支付方式</div>
          <ul class="way-list">
            <li class="way-li flex align-center">
              <div class="checkbox-wrap">
                <input type="checkbox" :checked="payWayObj.bank" @click="clickPayWay('bank')" />
              </div>
              <i class="iconfont icon-xinyongkayinhangka" />
              <div class="way-desc">
                <div class="desc1">银行卡 <span class="tip">免手续费</span></div>
                <div class="desc2">需先绑卡</div>
              </div>
            </li>
            <li class="way-li flex align-center">
              <div class="checkbox-wrap">
                <input type="checkbox" :checked="payWayObj.wx" @click="clickPayWay('wx')" />
              </div>
              <i class="iconfont icon-wechat" />
              <div class="way-desc">
                <div class="desc1">微信支付</div>
              </div>
            </li>
            <li class="way-li flex align-center">
              <div class="checkbox-wrap">
                <input type="checkbox" :checked="payWayObj.zfb" @click="clickPayWay('zfb')" />
              </div>
              <i class="iconfont icon-zhifubaozhifu" />
              <div class="way-desc">
                <div class="desc1">支付宝</div>
              </div>
            </li>
          </ul>
        </div>

        <div class="submit-btn-wrap">
          <button class="submit-btn" :class="{ 'disabled': disabledCanPay }" @click="goPay">立即支付</button>
        </div>
      </div>
    </div>

    <el-dialog
      v-model="dialogWxPayment"
      title="微信支付"
      width="500px"
      center
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      @close="wxPayClose"
    >
      <div class="flex-center direction-column">
        <vue-qrcode
          :value="wxpayUrl"
          :width="180"
          :color="{ dark: '#000000ff', light: '#ffffffff' }"
          type="image/png"
        />
        <div v-if="isRefresh" @click="refreshQrcode" class="flex-center direction-column">
          <div>二维码已过期</div>
          <el-button size="small">刷新</el-button>
        </div>
        <div>请使用微信扫一扫，扫描二维码支付</div>
      </div>
    </el-dialog>

    <CommonFooter />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, onBeforeUnmount } from 'vue'
import SiteNav from '@/components/SiteNav'
import CommonFooter from '@/components/CommonFooter'
import StepList from '@/components/StepList'
import { transferTime } from '@/utils/index'

//   import { useRouter } from 'vue-router'
//   const router = useRouter()

let stepActiveIndex = ref(1)

// 倒计时
let timeObj = reactive({
  day: 0,
  hour: 0,
  minute: 0,
  second: 0
})
const timeDesc = computed(() => {
  let desc = `${timeObj.day ? timeObj.day + '天' : ''}${!timeObj.hour && !timeObj.day ? '' : timeObj.hour + '时'}${
    timeObj.minute
  }分${timeObj.second}秒`
  return `请您在${desc}内完成支付，否则订单会被自动取消。`
})
const vMatchKeyword = {
  mounted: (el, binding) => {
    matchKeywordFn(el, binding)
  },
  updated: (el, binding) => {
    // 每秒时间改变时
    matchKeywordFn(el, binding)
  }
}
function matchKeywordFn(el, binding) {
  let txt = binding.arg // "n天n时n分n秒..."

  const reg = new RegExp(/(\d+)/g)
  let str = txt.replace(reg, `<span style="color:red;font-size:20px;margin:0 5px">$1</span>`)
  el.innerHTML = str
}
// 开始倒计时
let leftTime = 30 * 60 * 1000 // ms
let countDownTimer = null
let timeOver = ref(false)
handleCountDown()
startCountDown()
function handleCountDown() {
  let obj = transferTime(leftTime, false)
  timeObj.day = obj.day
  timeObj.hour = obj.hour
  timeObj.minute = obj.minute
  timeObj.second = obj.second
  if (!timeObj.day && !timeObj.hour && !timeObj.minute && !timeObj.second) {
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
  clearInterval(countDownTimer)
})

// 切换显示订单性情，默认隐藏
let showGoodsInfo = ref(false)
function toggleGoodsDetail() {
  showGoodsInfo.value = !showGoodsInfo.value
}
const goodsInfoRef = ref(null)
onMounted(() => {
  let goodsInfoInnerEle = document.getElementsByClassName('goods-info-inner')[0] || {}
  let eleHeight = goodsInfoInnerEle.offsetHeight
  goodsInfoRef.value.style.height = eleHeight + 'px'
})

// 付款方式
let payWayObj = reactive({
  bank: false,
  wx: false,
  zfb: false
})
function clickPayWay(way) {
  for (let key in payWayObj) {
    payWayObj[key] = false
  }
  payWayObj[way] = true
}
const disabledCanPay = computed(() => {
  let isDisabled = true
  for (let key in payWayObj) {
    if (payWayObj[key]) {
      isDisabled = false
      break
    }
  }
  return isDisabled
})
// 立即支付
let wxpayUrl = ref('')
let dialogWxPayment = ref(false)
let isRefresh = ref(false)
let payTimer = ref(null)
function goPay() {
  if (disabledCanPay.value) return
  if (payWayObj['bank']) {
    console.log('银行卡支付')
  } else if (payWayObj['wx']) {
    let res = {} // 接口返回
    wxpayUrl.value = res.url || 'https://www.baidu.com'
    dialogWxPayment.value = true
    // 开定时器检测付款状态，付款成功跳到订单
    checkWxPaymentStatus()
  } else if (payWayObj['zfb']) {
    // let res = {} // 接口返回
    // document.querySelector('body').innerHTML = res.data
    // document.forms[0].submit()
  }
}
// 每3秒检测一次
function checkWxPaymentStatus() {
  // test
  payTimer.value = setTimeout(() => {
    isRefresh.value = true
    // 过期清空定时器
    payTimer.value && clearTimeout(payTimer.value)
  }, 6000)
}
// 刷新微信支付二维码
function refreshQrcode() {
  wxpayUrl.value = 'https://news.baidu.com/'
  isRefresh.value = false
}
function wxPayClose() {
  payTimer.value && clearTimeout(payTimer.value)
  dialogWxPayment.value = false
  isRefresh.value = false
}
</script>

<style scoped lang="less">
.order-payment-page {
  background: #fff;
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
  .order-part {
    padding-bottom: 20px;
    background: #fff;
    .order-content {
      .order-wrap {
        margin-top: 12px;
        box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 20px;
        .base-info {
          padding: 22px 20px 18px;
          .info-left {
            .tit {
              font-size: 18px;
              margin-bottom: 12px;
              font-weight: 700;
            }
          }
          .info-right {
            .prices {
              color: @danger-color;
              .price {
                font-size: 20px;
                font-weight: 700;
              }
            }
            .detail-btn {
              color: @primary-color;
              cursor: pointer;
              .el-icon {
                vertical-align: -2px;
              }
            }
          }
        }
        .goods-info {
          border-top: 1px solid @border-line-color;
          transition: height 0.3s;
          background-color: @bg-gray-color;
          overflow: hidden;
          &.hide {
            height: 0 !important;
          }
          .goods-info-inner {
            padding: 10px;
          }
        }
      }
      .pay-wrap {
        margin-top: 20px;
        box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 20px;
        .pay-header {
          padding: 15px 20px;
          font-size: 16px;
          font-weight: bold;
          background-color: @light-gray-color;
        }
        .way-list {
          .way-li {
            height: 80px;
            padding: 0 10px;
            border-bottom: 1px solid @border-line-color;
            &:last-child {
              border-bottom: none;
            }
            .checkbox-wrap {
              padding-left: 10px;
              width: 50px;
              input[type='checkbox'] {
                width: 18px;
                height: 18px;
                line-height: 18px;
                text-align: center;
                vertical-align: -3px;
              }
            }
            .icon-xinyongkayinhangka {
              color: #5098fe;
              font-size: 22px;
            }
            .icon-wechat {
              color: #24c891;
              font-size: 21px;
            }
            .icon-zhifubaozhifu {
              color: #009fe8;
              font-size: 18px;
            }
            .way-desc {
              margin-left: 8px;
              .tip {
                font-size: 10px;
                padding: 0 2px;
                margin-left: 3px;
                color: @primary-color;
                background-color: @primary-light-color;
              }
              .desc1 {
                font-size: 16px;
              }
              .desc2 {
                font-size: 13px;
              }
            }
          }
        }
      }

      .submit-btn-wrap {
        text-align: right;
        margin: 30px 0;
        .submit-btn {
          width: 140px;
          height: 46px;
          line-height: 46px;
          margin-right: 10px;
          padding: 0;
          background-color: @danger-color;
          color: #fff;
          font-weight: 700;
          font-size: 18px;
          font-family: arial, 'Microsoft YaHei';
          border-radius: 3px;
          cursor: pointer;
          border: 0;
          &.disabled {
            background-color: @disabled-font-color;
            &:hover {
              cursor: not-allowed;
              background-color: @disabled-font-color;
            }
          }
          &:hover {
            background-color: @focus-color;
          }
        }
      }
    }
  }
}
</style>
