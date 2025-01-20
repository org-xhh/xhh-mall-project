<template>
  <div class="home-page min-width-b">
    <div class="site-nav">
      <div class="site-nav-content main-b-width"></div>
    </div>

    <header>
      <div class="header-content main-b-width flex align-center"></div>
    </header>

    <div class="category-part">
      <div class="category-content main-b-width flex">
        <div class="category-left"></div>
        <div class="category-center">
          <el-skeleton style="width: 100%; height: 100%" animated :throttle="500">
            <template #template>
              <el-skeleton-item variant="image" style="width: 100%; height: 100%" />
            </template>
          </el-skeleton>
        </div>
        <div class="ad-add" v-if="pageWidth >= limitPageWidth"></div>
        <div class="category-right"></div>
      </div>
    </div>

    <main>
      <div class="main-part main-b-width">
        <div class="channel-part">
          <el-skeleton :rows="5" animated :count="2" />
        </div>
        <div class="recommend-part">
          <div class="title"></div>
          <div class="recommend-list flex flex-wrap">
            <div class="recommend-item" v-for="(item, index) in recommendList" :key="index">
              <div class="recommend-item-content flex-center" @click="goGoodsDetail(item)">
                <el-skeleton style="width: 142px" animated :throttle="500">
                  <template #template>
                    <el-skeleton-item variant="image" style="width: 142px; height: 136px" />
                    <div style="padding: 14px">
                      <el-skeleton-item variant="h3" style="width: 50%" />
                      <div
                        style="
                          display: flex;
                          align-items: center;
                          justify-items: space-between;
                          margin-top: 16px;
                          height: 16px;
                        "
                      >
                        <el-skeleton-item variant="text" style="margin-right: 16px" />
                        <el-skeleton-item variant="text" style="width: 30%" />
                      </div>
                    </div>
                  </template>
                </el-skeleton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer>
      <div class="footer-content main-b-width"></div>
    </footer>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
let resizeFn = proxy.$resize // 方法
let limitPageWidth = resizeFn().limitPageWidth
let pageWidth = ref(resizeFn().docWidth)
window.addEventListener('resize', () => {
  pageWidth.value = resizeFn().docWidth
})

let recommendList = ref(new Array(10))
</script>

<style scoped lang="less">
.home-page {
  background: @bg-gray-color;
  .title {
    height: 52px;
  }
  .site-nav {
    border-bottom: 1px solid @border-line-color;
    background: @bg-gray-color;
    .site-nav-content {
      height: 36px;
    }
  }
  header {
    border-bottom: 1px solid @border-line-color;
    background: #fff;
    height: 122px;
    .header-content {
    }
  }
  .category-part {
    margin: 10px 0;
    .category-content {
      height: 420px;
      > div {
        background-color: #fff;
        height: 100%;
        &.category-left {
          width: 190px;
        }
        &.category-center {
          width: 790px;
          margin: 0 10px;
          overflow: hidden;
        }
        &.ad-add {
          width: 190px;
          margin-right: 10px;
        }
        &.category-right {
          width: 190px;
        }
      }
    }
  }
  main {
    position: relative;
    .main-part {
      .channel-part {
        min-height: 500px;
        background-color: #fff;
        padding: 55px 35px 0;
      }
      .recommend-part {
        margin-top: 10px;
        .recommend-list {
          .recommend-item {
            min-height: 200px;
            width: 20%;
            padding: 0 5px 10px;
            /* 5, 10, 15... */
            &:nth-child(5n) {
              padding-right: 0;
            }
            /* 1, 6, 11... */
            &:nth-child(5n + 1) {
              padding-left: 0;
            }
            .recommend-item-content {
              height: 100%;
              padding-top: 10px;
              background-color: @light-gray-color;
              padding: 5px;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  footer {
    margin-top: 10px;
    .footer-content {
      min-height: 300px;
    }
  }
}
.html-mini {
  .home-page {
    min-width: @page-s-width;
    .site-nav {
      .site-nav-content {
        width: @page-s-width;
      }
    }
    header {
      .header-content {
        width: @page-s-width;
      }
    }
    .category-part {
      .category-content {
        width: @page-s-width;
      }
    }
    main {
      .main-part {
        width: @page-s-width;
        .recommend-part {
          .recommend-list {
            .recommend-item {
              .recommend-item-content {
              }
            }
          }
        }
      }
    }
    footer {
      .footer-content {
        width: @page-s-width;
      }
    }
  }
}
</style>
