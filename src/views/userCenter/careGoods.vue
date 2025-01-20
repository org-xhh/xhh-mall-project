<template>
  <div class="carousel-drag-wrap">
    <ul class="carousel-ul flex">
      <li><img src="@/assets/images/activityImgs/img1.png" /></li>
      <li><img src="@/assets/images/activityImgs/img2.png" /></li>
      <li><img src="@/assets/images/activityImgs/img3.png" /></li>
      <li><img src="@/assets/images/activityImgs/img4.png" /></li>
      <li><img src="@/assets/images/activityImgs/img5.png" /></li>
      <li><img src="@/assets/images/activityImgs/img6.png" /></li>
      <li><img src="@/assets/images/activityImgs/img7.png" /></li>
      <li><img src="@/assets/images/activityImgs/img8.png" /></li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import carouselDragObj from '@/utils/carouselDrag'

onMounted(() => {
  // 定时轮播，可拖动
  carouselDragObj.start({
    time: 2000
  })
})
onBeforeUnmount(() => {
  carouselDragObj.destroy()
})
</script>

<style scoped lang="less">
.carousel-drag-wrap {
  width: 880px;
  padding: 15px 0;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  margin: 0 auto;
  .carousel-ul {
    li {
      width: 220px;
      flex-shrink: 0;
      height: 220px;
      border: 1px solid #ccc;
      padding: 5px;
      white-space: nowrap;
      > img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
