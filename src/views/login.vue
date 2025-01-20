<template>
  <div class="login-page">
    <header>
      <div class="header-content main-s-width flex align-end space-between">
        <div class="flex align-center">
          <img src="../assets/images/logo.jpg" class="logo" />
          <div class="tit">欢迎登录</div>
        </div>
        <div class="suggest">
          <el-icon color="#e1251b" size="16"><ChatDotSquare /></el-icon>登录页面，改进建议
        </div>
      </div>
    </header>

    <div class="main-part">
      <div class="main-content main-s-width">
        <div class="login-wrap">
          <div class="way-part">
            <img v-if="isPcLogin" src="@/assets/images/login/login_code.png" @click="toggleWay('code')" />
            <img v-else src="@/assets/images/login/login_pc.png" @click="toggleWay()" />
          </div>
          <div v-if="isPcLogin" class="login-code-tip">
            扫码登录安全快捷
            <div class="triangle"></div>
          </div>
          <div v-if="isPcLogin" class="login-content">
            <ul class="login-list flex">
              <li class="login-li" :class="{ 'active': isPwdLogin }" @click="toggleLogin('pwd')">密码登录</li>
              <li class="login-li" :class="{ 'active': !isPwdLogin }" @click="toggleLogin()">短信登录</li>
            </ul>
            <!-- [DOM] Password field is not contained in a form -->
            <form class="input-login-part">
              <template v-if="isPwdLogin">
                <div class="per-item">
                  <el-input placeholder="账号名/手机号/邮箱" v-model.trim="pwdObj.account" clearable />
                </div>
                <div class="per-item">
                  <el-input
                    placeholder="密码"
                    type="password"
                    autocomplete="off"
                    v-model.trim="pwdObj.password"
                    show-password
                    clearable
                  />
                </div>
                <!-- <div class="error-tip">账号与密码不匹配，请重新输入</div> -->
                <div class="forget-pwd"><span>忘记密码</span></div>
                <el-button
                  class="login-btn"
                  :class="{ 'disabled': !pwdLoginValid }"
                  v-throttle
                  @click="pwdLoginValid ? handlePwdLogin() : ''"
                >
                  登&nbsp;&nbsp;&nbsp;&nbsp;录
                </el-button>
              </template>
              <template v-if="!isPwdLogin">
                <div class="per-item">
                  <el-input v-model.trim="smsObj.mobile" maxlength="30" placeholder="请输入手机号">
                    <template #prepend>
                      <el-select v-model="smsObj.area" style="width: 75px">
                        <template #header>
                          <el-input v-model="smsObj.areaSearch" placeholder="搜索您的国家和地区">
                            <template #prepend>
                              <el-button :icon="Search" />
                            </template>
                          </el-input>
                        </template>
                        <el-option v-for="item in areaList" :key="item.value" :label="item.value" :value="item.value">
                          <span style="float: left">{{ item.label }}</span>
                          <span style="float: right; font-size: 13px">{{ item.value }}</span>
                        </el-option>
                      </el-select>
                    </template>
                  </el-input>
                </div>
                <div class="per-item">
                  <el-input
                    placeholder="请输入验证码"
                    v-model.trim="smsObj.verifyCode"
                    maxlength="6"
                    clearable
                    class="verify-code-input"
                  >
                    <template #append>
                      <el-button
                        class="verify-btn"
                        :class="{ 'disabled': !isCanSend || showCountDown }"
                        @click="sendVerifyCode"
                        >{{
                          showCountDown ? countTime + '秒后重新发送' : sendTimes ? '重新发送' : '获取验证码'
                        }}</el-button
                      >
                    </template>
                  </el-input>
                </div>
                <div class="error-tip" v-if="showSmsLoginTip">请先发送短信验证码</div>
                <el-button
                  class="login-btn sms-login-btn"
                  :class="{ 'disabled': !smsLoginValid }"
                  v-throttle
                  @click="smsLoginValid ? handleSmsLogin() : ''"
                >
                  登&nbsp;&nbsp;&nbsp;&nbsp;录
                </el-button>
              </template>
            </form>
          </div>
          <div v-else class="qrcode-part flex align-center direction-column">
            <vue-qrcode
              :value="loginUrl"
              :width="180"
              :color="{ dark: '#000000ff', light: '#ffffffff' }"
              type="image/png"
            />
            <div v-if="isRefresh" @click="refreshQrcode" class="expire-con flex-center direction-column">
              <div class="tip">二维码已失效</div>
              <el-button size="small">刷新</el-button>
            </div>
            <div class="scan-desc">扫描二维码</div>
            <ul class="qrcode-more">
              <li><i class="iconfont icon-zhuce-mianshuru" />免输入</li>
              <li><i class="iconfont icon-gengkuai_huaban" />更快</li>
              <li><i class="iconfont icon-genganquan" />更安全</li>
            </ul>
          </div>
          <div class="sign-up">
            <span>立即注册</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-part">
      <div class="footer-content main-s-width">
        <ul class="link-ul flex justify-center">
          <li v-for="(item, index) in linkList" :key="index">
            {{ item }}
          </li>
        </ul>
        <div class="copyright flex justify-center">Copyright © 2023-{{ new Date().getFullYear() }} 版权所有</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { isMobile } from '@web-xhh/web-utils'
const router = useRouter()
import { paramsToObj } from '@web-xhh/web-utils'

import { Search } from '@element-plus/icons-vue'

let isPcLogin = ref(true)
let isPwdLogin = ref(true)
let showCountDown = ref(false) // 显示验证码倒计时
const COUNT_DOWN_VALUE = 60
let countTime = ref(COUNT_DOWN_VALUE) // 秒
let countTimer = null
let sendTimes = ref(0)
let showSmsLoginTip = ref(false)
let pwdObj = reactive({
  account: '',
  password: ''
})
let smsObj = reactive({
  mobile: '',
  area: '0086',
  areaSearch: '',
  verifyCode: ''
})
let areaList = reactive([
  {
    value: '0086',
    label: '中国'
  },
  {
    value: '0852',
    label: '中国香港'
  },
  {
    value: '0853',
    label: '中国澳门'
  },
  {
    value: '0886',
    label: '中国台湾'
  }
])

let loginUrl = ref('')
function toggleWay(flag) {
  isPcLogin.value = flag !== 'code'
  if (!isPcLogin.value) {
    // 调接口
    loginUrl = ref('https://www.baidu.com')
    checkQrCodeStatus()
  } else {
    payTimer.value && clearTimeout(payTimer.value)
    isRefresh.value = false
  }
}
function toggleLogin(flag) {
  isPwdLogin.value = flag === 'pwd'
}
const pwdLoginValid = computed(() => {
  return pwdObj.account && pwdObj.account.trim() && pwdObj.password && pwdObj.password.trim()
})
const smsLoginValid = computed(() => {
  return isMobile(smsObj.mobile) && smsObj.verifyCode && smsObj.verifyCode.trim()
})
const isCanSend = computed(() => {
  return isMobile(smsObj.mobile)
})
function handlePwdLogin() {
  console.log('密码登录')
  goHome()
}
function handleSmsLogin() {
  if (!sendTimes.value) {
    showSmsLoginTip.value = true
    return
  }
  console.log('验证码登录')
  goHome()
}
function sendVerifyCode() {
  showSmsLoginTip.value && (showSmsLoginTip.value = false)
  showCountDown.value = true
  sendTimes.value++
  countTimer = setInterval(() => {
    if (countTime.value > 1) {
      countTime.value -= 1
    } else {
      clearInterval(countTimer)
      countTimer = null
      showCountDown.value = false
      countTime = ref(COUNT_DOWN_VALUE)
    }
  }, 1000)
}
onBeforeUnmount(() => {
  clearInterval(countTimer)
})
// 二维码登录
let isRefresh = ref(false)
let payTimer = ref(null)
// 每3秒检测一次，轮询调接口成功就跳首页
function checkQrCodeStatus() {
  // test
  payTimer.value = setTimeout(() => {
    isRefresh.value = true
    // 过期清空定时器
    payTimer.value && clearTimeout(payTimer.value)
  }, 6000)
}
// 刷新登录二维码
function refreshQrcode() {
  loginUrl.value = 'https://news.baidu.com/'
  isRefresh.value = false

  checkQrCodeStatus()
}

let linkList = reactive(['关于我们', '联系我们', '商家入驻', '广告服务', '友情链接', '销售联盟'])

function goHome() {
  localStorage.setItem('xhhToken', 'xhh')

  let routerValue = router.currentRoute.value
  // fullPath: "/login?pageRedirect=/goodsDetail?id=1&name=2"
  if (~routerValue.fullPath.indexOf('pageRedirect')) {
    // pageRedirect=/goodsDetail?id=1&name=2
    let fullParams = routerValue.fullPath.slice(7)
    // console.log('fullParams:', fullParams)
    if (~fullParams.indexOf('?')) {
      router.replace({
        path: fullParams.split('?')[0].split('=')[1],
        query: paramsToObj(fullParams.split('?')[1])
      })
    } else {
      router.replace({
        path: fullParams.split('=')[1]
      })
    }
  } else {
    router.replace({
      path: '/home'
    })
  }
}
</script>

<style scoped lang="less">
.login-page {
  header {
    .header-content {
      .logo {
        width: 120px;
      }
      .tit {
        font-size: 32px;
        letter-spacing: 3px;
      }
      .suggest {
        font-size: 12px;
        margin-bottom: 13px;
        cursor: pointer;
        color: @gray-font-color;
        .el-icon {
          margin-right: 4px;
          vertical-align: -4px;
        }
        &:hover {
          color: @focus-color;
          text-decoration: underline;
        }
      }
    }
  }
  .main-part {
    background: #940d0a;
    .main-content {
      position: relative;
      height: 475px;
      background: #c01410;
      // background: #ccc;
      .login-wrap {
        position: absolute;
        width: 300px;
        height: 335px;
        right: 10px;
        top: 70px;
        border-radius: 8px;
        background: #fff;
        padding: 12px 16px;
        .way-part {
          position: absolute;
          top: 15px;
          right: 4px;
          width: 48px;
          height: 48px;
          cursor: pointer;
          > img {
            width: 100%;
            height: 100%;
          }
        }
        .login-code-tip {
          position: absolute;
          top: 20px;
          right: 53px;
          font-size: 12px;
          padding: 1px 5px;
          border-radius: 2px;
          background-color: rgba(0, 0, 0, 0.2);
          .triangle {
            position: absolute;
            top: 5.5px;
            right: -4px;
            width: 0;
            height: 0;
            transform: rotate(-45deg);
            border-top: 4px solid transparent;
            border-bottom: 4px solid rgba(0, 0, 0, 0.3);
            border-left: 4px solid transparent;
            border-right: 4px solid rgba(0, 0, 0, 0.3);
          }
        }
        .login-content {
          margin-top: 45px;
          .login-list {
            margin-bottom: 20px;
            .login-li {
              font-size: 16px;
              font-weight: 400;
              cursor: pointer;
              &.active {
                font-weight: 600;
                color: @primary-color;
              }
              &:not(:first-child) {
                margin-left: 22px;
              }
            }
          }
          .input-login-part {
            .per-item {
              &:not(:first-child) {
                .el-input {
                  margin-top: 16px;
                }
              }
              .el-input {
                font-size: 12px;
                &.verify-code-input {
                  :deep(.el-input__wrapper) {
                    box-shadow: 0 -1px 0 0 var(--el-input-border-color) inset,
                      0 1px 0 0 var(--el-input-border-color) inset, 1px 0 0 0 var(--el-input-border-color) inset;
                  }
                  :deep(.el-input-group__append) {
                    padding: 2px;
                    background-color: #fff;
                    .el-button {
                      margin: 0;
                    }
                  }
                }
              }
              :deep(.el-select) {
                .el-select__wrapper {
                  font-size: 12px;
                }
              }
              .verify-btn {
                border: none;
                outline: none;
                cursor: pointer;
                font-size: 12px;
                height: 100%;
                color: @primary-color;
                background-color: #fff;
                &.disabled {
                  color: @gray-font-color;
                  cursor: not-allowed;
                }
                &:focus {
                  border: none;
                  outline: none;
                }
              }
            }
            .error-tip {
              margin-top: 5px;
              font-size: 12px;
              color: @danger-color;
            }
            .forget-pwd {
              text-align: right;
              margin: 6px 0;
              span {
                font-size: 12px;
                margin-bottom: 10px;
                cursor: pointer;
                color: @gray-font-color;
                &:hover {
                  color: @focus-color;
                  text-decoration: underline;
                }
              }
            }
            .login-btn {
              width: 100%;
              height: 36px;
              line-height: 36px;
              border: none;
              outline: none;
              background-color: @primary-color;
              color: #fff;
              font-size: 15px;
              cursor: pointer;
              font-weight: 600;
              border-radius: 6px;
              &.sms-login-btn {
                margin-top: 16px;
              }
              &:focus {
                border: none;
                outline: none;
              }
              &.disabled {
                background-color: @primary-light-color;
                cursor: not-allowed;
              }
            }
          }
        }
        .qrcode-part {
          position: relative;
          top: 30px;
          > img {
            position: absolute;
          }
          .expire-con {
            position: absolute;
            width: 180px;
            height: 180px;
            background-color: rgba(0, 0, 0, 0.6);
            .tip {
              color: #fff;
              margin-bottom: 10px;
            }
          }
          .scan-desc {
            position: absolute;
            top: 176px;
          }
          .qrcode-more {
            position: absolute;
            top: 190px;
            width: 90%;
            font-size: 12px;
            margin-top: 20px;
            > li {
              display: inline-block;
              width: 33%;
              text-align: center;
              color: @gray-font-color;
              .iconfont {
                margin-right: 3px;
                vertical-align: -2px;
                font-size: 18px;
              }
            }
          }
        }
        .sign-up {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 48px;
          line-height: 48px;
          padding: 0 20px;
          background-color: @light-gray-color;
          text-align: right;
          border-radius: 0 0 8px 8px;
          span {
            font-size: 12px;
            margin-bottom: 10px;
            cursor: pointer;
            color: @gray-font-color;
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
  .footer-part {
    height: 100px;
    padding-top: 20px;
    .footer-content {
      .link-ul {
        > li {
          padding: 0 10px;
          font-size: 12px;
          margin-bottom: 13px;
          cursor: pointer;
          color: #666;
          line-height: 12px;
          border-right: 1px solid #666;
          &:last-of-type {
            border-right: none;
          }
          &:hover {
            color: @focus-color;
            text-decoration: underline;
          }
        }
      }
      .copyright {
        font-size: 12px;
        margin: 10px 0;
      }
    }
  }
}
</style>
