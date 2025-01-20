<template>
  <div class="goods-category-list">
    <div class="category-wrap scrollbar" ref="categoryWrapRef">
      <ul class="category-list">
        <li
          v-for="(item, index) in categoryList"
          :key="index"
          class="category-li flex align-center"
          @mouseenter="mouseEnterFn(item)"
          @mouseleave="mouseleaveFn"
        >
          <img class="icon" :src="item.icon" />
          <div>{{ item.title }}</div>
        </li>
      </ul>
    </div>

    <div
      v-if="showCategoryExpand"
      class="category-expand"
      :style="{ 'left': categoryExpandLeft - 7 + 'px', 'width': categoryExpandWidth + 10 + 7 + 'px' }"
      @mouseleave="showCategoryExpand = false"
      @mouseenter="showCategoryExpand = true"
    >
      {{ categoryExpandTxt }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

let categoryList = reactive([
  {
    icon: new URL('../assets/images/goodsCategory/icon10.png', import.meta.url).href,
    title: '手机数码'
  },
  {
    icon: new URL('../assets/images/goodsCategory/icon2.png', import.meta.url).href,
    title: '鞋服专场'
  },
  {
    icon: new URL('../assets/images/goodsCategory/icon3.png', import.meta.url).href,
    title: '家电家具'
  },
  {
    icon: new URL('../assets/images/goodsCategory/icon4.png', import.meta.url).href,
    title: '五金器材'
  },
  {
    icon: new URL('../assets/images/goodsCategory/icon5.png', import.meta.url).href,
    title: '文具书本'
  },
  {
    icon: new URL('../assets/images/goodsCategory/icon6.png', import.meta.url).href,
    title: '品牌包包'
  },
  {
    icon: new URL('../assets/images/goodsCategory/icon7.png', import.meta.url).href,
    title: '零食小吃'
  },
  {
    icon: new URL('../assets/images/goodsCategory/icon8.png', import.meta.url).href,
    title: '海鲜直达'
  },
  {
    icon: new URL('../assets/images/goodsCategory/icon9.png', import.meta.url).href,
    title: '珠宝玉器'
  },
  {
    icon: new URL('../assets/images/goodsCategory/icon3.png', import.meta.url).href,
    title: '护肤美妆'
  },
  {
    icon: new URL('../assets/images/goodsCategory/icon1.png', import.meta.url).href,
    title: '发圈发饰'
  },
  {
    icon: new URL('../assets/images/goodsCategory/icon2.png', import.meta.url).href,
    title: '树脂配件'
  }
])
let categoryWrapRef = ref(null)
let categoryExpandLeft = ref(0)
let categoryExpandWidth = ref(0)
let showCategoryExpand = ref(false)
let categoryExpandTxt = ref('')

onMounted(() => {
  categoryExpandLeft.value = categoryWrapRef.value.offsetWidth
  let homeCategoryCenter = document.getElementById('home-category-center')
  categoryExpandWidth.value = homeCategoryCenter.offsetWidth
})
function mouseEnterFn(item) {
  categoryExpandTxt.value = item.title + '的子分类'
  showCategoryExpand.value = true
}
function mouseleaveFn() {
  showCategoryExpand.value = false
}
</script>

<style lang="less" scoped>
.goods-category-list {
  position: relative;
  width: 100%;
  height: 100%;
  .category-wrap {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    .category-list {
      width: 100%;
      .category-li {
        padding: 12px 0;
        font-size: 14px;
        cursor: pointer;
        padding-left: 28px;
        .icon {
          width: 14px;
          margin-right: 6px;
        }
        &:hover {
          color: #fff;
          background-color: @primary-light-color;
        }
      }
    }
  }
  .category-expand {
    position: absolute;
    top: 0;
    z-index: 3;
    height: 100%;
    padding: 15px;
    background-color: #fff;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
  }
}
</style>
