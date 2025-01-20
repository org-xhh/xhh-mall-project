<template>
  <div class="badge-ele">
    <slot></slot>
    <span
      v-if="count"
      class="count"
      :class="[{ 'big-count': count > 9 }, { 'large-count': count > 99 }]"
      :style="{ 'background-color': bgColor }"
      >{{ count > 99 ? '99+' : count }}</span
    >
  </div>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: () => 0,
    required: true // 必传这个字段
  },
  bgColor: {
    type: String,
    default: ''
  }
})
</script>

<style scoped lang="less">
.badge-ele {
  position: relative;
  .count {
    position: absolute;
    top: -3px;
    right: -12px;
    min-width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 100%;
    color: #fff;
    font-size: 11px;
    background-color: @focus-color;
    &.big-count {
      min-width: 20px;
      border-radius: 15px;
      right: -14px;
    }
    &.large-count {
      min-width: 26px;
      border-radius: 30px;
      right: -18px;
    }
  }
}
</style>
