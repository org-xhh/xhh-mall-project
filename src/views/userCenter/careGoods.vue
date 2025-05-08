<template>
  <div class="carousel-drag-wrap">
    <ul class="carousel-ul flex">
      <li class="flex direction-column">
        <img src="@/assets/images/activityImgs/img1.png" />
        <div>钢筋水泥</div>
      </li>
      <li class="flex direction-column">
        <img src="@/assets/images/activityImgs/img2.png" />
        <div>电气设备</div>
      </li>
      <li class="flex direction-column">
        <img src="@/assets/images/activityImgs/img3.png" />
        <div>小型机械</div>
      </li>
      <li class="flex direction-column">
        <img src="@/assets/images/activityImgs/img4.png" />
        <div>包装物</div>
      </li>
      <li class="flex direction-column">
        <img src="@/assets/images/activityImgs/img5.png" />
        <div>办公档案设备</div>
      </li>
      <li class="flex direction-column">
        <img src="@/assets/images/activityImgs/img6.png" />
        <div>日用品</div>
      </li>
      <li class="flex direction-column">
        <img src="@/assets/images/activityImgs/img7.png" />
        <div>数码相机</div>
      </li>
      <li class="flex direction-column">
        <img src="@/assets/images/activityImgs/img8.png" />
        <div>时尚服装</div>
      </li>
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
      height: 230px;
      border: 1px solid #ccc;
      padding: 5px;
      white-space: nowrap;
      > img {
        width: 100%;
        height: 188px;
        flex-shrink: 0;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
