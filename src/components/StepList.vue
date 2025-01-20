<template>
  <ul class="progress-list-ul flex">
    <li
      v-for="(item, index) in progressList"
      :key="index"
      class="flex-center direction-column flex1"
      :class="{ 'active': props.stepActiveIndex >= index, 'active-line': props.stepActiveIndex > index }"
    >
      <div v-if="index !== progressList.length - 1" class="line"></div>
      <div class="circle"></div>
      <div class="name">{{ item.name }}</div>
      <div v-if="props.stepActiveIndex > index && props.stepActiveIndex !== 0" class="date">{{ item.date }}</div>
    </li>
  </ul>
</template>

<script setup>
import { reactive } from 'vue'

const props = defineProps({
  stepActiveIndex: Number
})
let progressList = reactive([
  {
    name: '下单',
    date: '2024-01-01 13:45:00'
  },
  {
    name: '付款',
    date: '2024-01-02 13:45:00'
  },
  {
    name: '发货',
    date: '2024-01-03 13:45:00'
  },
  {
    name: '收货',
    date: '2024-01-04 13:45:00'
  },
  {
    name: '评价',
    date: '2024-01-05 13:45:00'
  }
])
</script>

<style scoped lang="less">
.progress-list-ul {
  width: 100%;
  align-items: flex-start;
  li {
    position: relative;
    text-align: center;
    &.active {
      .circle {
        border-color: @primary-color;
      }
      .name {
        color: @primary-color;
      }
      .date {
        color: @primary-color;
      }
    }
    &.active-line {
      .line {
        background-color: @primary-color;
      }
    }
    .circle {
      position: relative;
      width: 24px;
      height: 24px;
      border-radius: 100%;
      border: 1px solid #000;
      background-color: #fff;
    }
    .name {
      font-size: 16px;
      margin-top: 6px;
    }
    .date {
      padding: 0;
    }
    .line {
      position: absolute;
      top: 12px;
      left: 50%;
      width: 100%;
      height: 2px;
      background-color: @border-line-color;
    }
  }
}
</style>
