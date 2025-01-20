<template>
  <div class="common-tab-list flex">
    <Badge
      class="per-ele"
      v-for="(item, index) in tabList"
      :key="item.id || index"
      :class="{ 'active': index === activeIndex }"
      @click="clickTab(index, item)"
      :count="item.count"
    >
      {{ item.title }}
    </Badge>
  </div>
</template>

<script setup>
import Badge from '@/components/Badge'
const props = defineProps({
  tabList: {
    type: Array,
    default: () => [],
    reqiured: true,
    validator: (val) => val.length >= 1 // 至少要有一条数据，不然报警告
  },
  activeIndex: {
    type: Number,
    default: 0
  }
})

const emitEvent = defineEmits(['clickTabFn'])
function clickTab(index, item) {
  if (index === props.activeIndex) return
  emitEvent('clickTabFn', index, item)
}
</script>

<style scoped lang="less">
.common-tab-list {
  .per-ele {
    font-size: 13px;
    padding: 1px 0;
    margin-right: 23px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    &.active {
      color: @focus-color;
      font-weight: 700;
      border-bottom: 2px solid @focus-color;
    }
    &:hover {
      color: @focus-color;
    }
  }
}
</style>
