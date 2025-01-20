<template>
  <div class="per-part">
    <div class="tit">{{ props.menuObj.tit }}</div>
    <ul class="list">
      <li
        class="li"
        v-for="(item, index) in props.menuObj.list"
        :key="index"
        :class="{ 'active': props.activeMenuValue === item.key }"
        @click="toggleMenuLi(item)"
      >
        {{ item.title }}
      </li>
    </ul>
  </div>
</template>

<script setup>
const props = defineProps({
  menuObj: Object,
  activeMenuValue: String
})

const emitEvent = defineEmits(['emitToggleMenuLi'])
function toggleMenuLi(item) {
  emitEvent('emitToggleMenuLi', item)
}
</script>

<style scoped lang="less">
.per-part {
  width: 100%;
  text-align: left;
  margin-bottom: 22px;
}
.tit {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 4px;
}
.list {
  .li {
    font-size: 12px;
    line-height: 13px;
    padding: 6px 1px;
    cursor: pointer;
    &.active {
      color: @focus-color;
      font-weight: 700;
    }
    &:hover {
      color: @focus-color;
      text-decoration: underline;
    }
  }
}
</style>
