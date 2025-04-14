<template>
  <header>
    <div class="header-content main-b-width flex align-center">
      <img src="../assets/images/logo.jpg" class="logo" />

      <div class="search-part">
        <div class="search-top flex align-center">
          <div class="search-con flex align-center">
            <el-input
              class="input"
              v-model="keywords"
              @focus="keywordsFocus"
              @blur="keywordsBlur"
              v-eventDebounce="[() => keywordsInput(), 500, true, 'input']"
            />
            <button class="search-btn" type="primary"><i class="iconfont icon-sousuo" /></button>
            <div v-if="showKeywordsDialog && keywords" class="keywords-tip-dialog">
              <ul>
                <li v-for="(item, index) in 10" :key="index">
                  <span>{{ keywords }}</span
                  ><span class="associational-word">{{ index }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div v-if="routeName !== 'shopCart'" class="shop-cart flex-center" @click="goShopCart">
            <Badge class="cart-con" :count="cartNum">
              <i class="iconfont icon-gouwuchekong" />
            </Badge>
            我的购物车
          </div>
        </div>

        <div class="search-history">
          <span>商品1</span>
          <span>商品2</span>
          <span>商品3</span>
        </div>
      </div>

      <div v-if="routeName === 'waterfallPage'" id="threejs-wrap"></div>
    </div>
  </header>

  <!-- <Teleport to=".header-content">
    <div>将一个组件内部的一部分模板“传送”到该组件的 DOM 结构外层的位置去。</div>
  </Teleport> -->
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Badge from '@/components/Badge'
import { initThreeScene } from '@/utils/threejsUtil'

const router = useRouter()
let routeName = router.currentRoute.value.name

let keywords = ref('')

// pinia
import { useCounterStore } from '@/store/counter'
const counter = useCounterStore()
let cartNum = ref(counter.count)
watch(
  () => counter.$state,
  (newState) => {
    cartNum.value = newState.count
  },
  { deep: true }
)
// watchEffect：可以自动监听数据源作为依赖，不用指明监听那个数据，监听的回调中用到哪个数据，那就监听哪个数据

// 搜索
let showKeywordsDialog = ref(false)
function keywordsFocus() {
  showKeywordsDialog.value = true
}
function keywordsBlur() {
  showKeywordsDialog.value = false
}
function keywordsInput() {
  console.log('快速搜索兼容', keywords.value)
}
function goShopCart() {
  const { href } = router.resolve({
    name: 'shopCart'
  })
  window.open(href, '_blank')
}

onMounted(() => {
  if (routeName === 'waterfallPage') {
    initThreeRect()
  }
})
// threejs
function initThreeRect() {
  let threeContainer = document.getElementById('threejs-wrap') || {}
  let threeRect = (threeContainer.getBoundingClientRect && threeContainer.getBoundingClientRect()) || {}
  initThreeScene(threeContainer, threeRect.width, threeRect.height)
}
</script>

<style scoped lang="less">
.html-mini {
  .home-page {
    header {
      .header-content {
        width: @page-s-width;
      }
    }
  }
}
header {
  border-bottom: 1px solid @border-line-color;
  background: #fff;
  height: 122px;
  .header-content {
    .logo {
      width: 120px;
    }
    .search-part {
      margin-left: 80px;
      .search-top {
        .search-con {
          position: relative;
          margin-right: 50px;
          height: 36px;
          .input {
            width: 430px;
            height: 100%;
            :deep(.el-input__wrapper) {
              border-radius: 0;
            }
          }
          .search-btn {
            width: 58px;
            background-color: @primary-color;
            height: 100%;
            border: none;
            outline: none;
            cursor: pointer;
            i {
              color: #fff;
              font-size: 20px;
            }
            &:hover,
            &:focus {
              border: none;
              outline: none;
            }
          }
          .keywords-tip-dialog {
            position: absolute;
            top: 36px;
            left: 0;
            z-index: 2;
            width: 430px;
            border: 1px solid @light-gray-color;
            border-top: none;
            background-color: #fff;
            padding: 10px 0;
            max-height: 300px;
            overflow-y: auto;
            ul {
              li {
                padding: 1px 10px;
                word-break: break-word;
                cursor: pointer;
                &:hover {
                  background-color: @bg-gray-color;
                }
                .associational-word {
                  font-weight: bold;
                }
              }
            }
          }
        }
        .shop-cart {
          width: 132px;
          height: 36px;
          border: 2px solid @primary-color;
          color: @primary-color;
          border-radius: 2px;
          cursor: pointer;
          .cart-con {
            margin-right: 12px;
            .iconfont {
              color: @primary-color;
              font-size: 17px;
            }
            .cart-num {
              position: absolute;
              right: -12px;
              top: -4px;
              width: 18px;
              height: 18px;
              background-color: @danger-color;
              border-radius: 100%;
              color: #fff;
              font-size: 12px;
              &.big-num {
                width: 22px;
                border-radius: 8px;
              }
              &.max-num {
                width: 26px;
                border-radius: 8px;
                right: -16px;
              }
            }
          }
        }
      }
      .search-history {
        margin-top: 6px;
        font-size: 12px;
        color: @gray-font-color;
        width: 480px;
        height: 20px;
        overflow: hidden;
        span {
          margin-right: 15px;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
        }
      }
    }
    #threejs-wrap {
      width: 200px;
      height: 100px;
      cursor: pointer;
    }
  }
}
</style>
