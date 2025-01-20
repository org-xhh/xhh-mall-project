<template>
  <div class="address-wrap">
    <ul class="flex flex-wrap addr-list">
      <li
        v-for="(item, index) in addressList"
        :key="item.id"
        class="addr-li"
        :class="{ 'active': addrActive === index }"
        @click="toggleAddress(index)"
      >
        <div v-if="item.isdefault === 1" class="default-desc">默认地址</div>
        <div class="person-name flex ellipsis1">
          <div class="city-name flex">{{ item.province }}{{ item.city }}</div>
          <div class="name ellipsis1">（{{ item.personName }}收）</div>
        </div>
        <div class="addr-info">{{ item.county }}{{ item.addressDetail }} {{ item.mobile }}</div>
        <div v-if="addrActive === index" class="operate-info">
          <span class="edit-btn">修改</span>
        </div>
        <div v-if="addrActive === index" class="selected-icon">
          <el-icon size="12" color="#fff"><Select /></el-icon>
        </div>
      </li>
    </ul>
    <div class="addr-more flex space-between">
      <div>添加新地址</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

let addrActive = ref(0)
let addressList = reactive([
  {
    id: 1,
    personName: '谢谢',
    mobile: '16****6666',
    province: '江苏省',
    city: '徐州市',
    county: '云龙区',
    addressDetail: '丽水路',
    isdefault: 1
  },
  {
    id: 2,
    personName: '谢谢谢谢谢谢谢谢谢谢谢谢谢谢',
    mobile: '166****8888',
    province: '江苏省',
    city: '徐州市',
    county: '沛县',
    addressDetail: '丽水路丽水路丽水路丽水路丽水路丽水路丽水路1号',
    isdefault: 0
  },
  {
    id: 3,
    personName: '珺珺',
    mobile: '166****8888',
    province: '江苏省',
    city: '徐州市',
    county: '沛县',
    addressDetail: '丽水路丽水路丽水路丽水路丽水路丽水路丽水路1号',
    isdefault: 0
  }
])
function toggleAddress(index) {
  if (addrActive.value === index) return
  addrActive.value = index
}
</script>

<style scoped lang="less">
.address-wrap {
  .addr-list {
    .addr-li {
      position: relative;
      width: 237px;
      height: 106px;
      margin-right: 14px;
      margin-bottom: 14px;
      cursor: pointer;
      padding: 0 14px 14px 14px;
      background: url('../../assets/images/addr_bg.avif') no-repeat;
      &.active {
        background: url('@/assets/images/addr_selected.jpg') no-repeat;
      }
      .default-desc {
        position: absolute;
        top: 0;
        right: 0;
        color: #fff;
        font-size: 12px;
        padding: 1px 3px;
        background: #ccc;
        opacity: 0.7;
      }
      .person-name {
        padding: 8px 0 2px;
        border-bottom: 1px solid @border-line-color;
        font-size: 14px;
        font-weight: bold;
      }
      .addr-info {
        height: 41px;
        overflow: hidden;
        padding-top: 5px;
        font-size: 12px;
        /* word-break: break-word; */
        word-break: break-all;
      }
      .operate-info {
        margin-top: 2px;
        .edit-btn {
          font-size: 12px;
          color: @edit-btn-color;
          &:hover {
            color: @focus-color;
          }
        }
      }
      .selected-icon {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 0;
        height: 0;
        border-top: 13px solid transparent;
        border-bottom: 13px solid @danger-color;
        border-left: 13px solid transparent;
        border-right: 13px solid @danger-color;
        .el-icon {
          position: absolute;
          bottom: -11px;
          right: -11px;
        }
      }
    }
  }
  .addr-more {
    margin-top: 5px;
    font-size: 12px;
    > div {
      color: @edit-btn-color;
      cursor: pointer;
      &:first-child {
        padding: 1px 6px;
        border-radius: 4px;
        border: 1px solid @edit-btn-color;
        &:hover {
          border: 1px solid @primary-color;
        }
      }
      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
