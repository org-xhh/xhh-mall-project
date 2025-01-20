<template>
  <div class="main-part">
    <div class="search-part flex align-center space-between">
      <CommonTabBar :tabList="tabList" :activeIndex="tabActiveIndex" @clickTabFn="clickTabFn" />
      <div class="search-enter flex align-center">
        <el-input v-model="keyword" placeholder="商品名称/商品编号/订单号">
          <template #append><el-button type="primary" icon="Search" /></template>
        </el-input>
        <div class="more-filter flex align-center" @click="clickMoreFilter">
          更多筛选 <el-icon :class="{ 'rotate': showMoreFilter }"><ArrowDown /></el-icon>
        </div>
      </div>
    </div>
    <div v-if="showMoreFilter" class="filter-more">
      <el-icon size="25" @click="closeMoreFilter"><CircleClose /></el-icon>
      <div v-for="(item, index) in orderFilterList" :key="index" class="flex per-filter align-start">
        <div class="left-name">{{ item.title }}：</div>
        <ul class="right-con flex flex-wrap">
          <li
            v-for="(subItem, subIndex) in item.list"
            :key="subIndex"
            :class="{ 'active': subIndex === item.active }"
            @click="clickFilterLi(index, subIndex)"
          >
            {{ subItem.title }}
          </li>
        </ul>
      </div>
    </div>
    <div class="order-part">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column label="商品图片" width="180" align="center">
          <template v-slot="scope">
            <el-image
              :src="scope.row.mainpic"
              fit="contain"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              :preview-teleported="true"
              :preview-src-list="[scope.row.mainpic]"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品名称" align="center" />
        <el-table-column prop="pricetitle" label="规格" width="120" align="center" />
        <el-table-column label="单价" width="120" align="center">
          <template v-slot="scope"
            ><span class="red-column">￥{{ scope.row.price }}</span></template
          >
        </el-table-column>
        <el-table-column prop="count" label="数量" width="120" align="center">
          <template v-slot="scope">{{ scope.row.count }}{{ scope.row.unit }}</template>
        </el-table-column>
        <el-table-column label="总价" width="120" align="center">
          <template v-slot="scope"
            ><span class="red-column">￥{{ scope.row.totalPrice }}</span></template
          >
        </el-table-column>
        <el-table-column label="交易状态" width="120" align="center">
          <template v-slot="scope">
            <div class="orange-style">
              {{ filterStatusFn(scope.row) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template #default="scope">
            <div class="operate-btn-wrap flex direction-column align-center">
              <div
                v-for="(item, index) in orderBtnListFn(scope.row)"
                :key="index"
                class="operate-btn"
                :class="'btn' + item.btnStatus"
              >
                {{ item.btnTxt }}
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import CommonTabBar from '@/components/CommonTabBar'

import { orderStatusTxt, orderStatusBtnList } from '@/utils/orderStatus'
// 订单状态
let filterStatusFn = orderStatusTxt
// 订单操作按钮
let orderBtnListFn = orderStatusBtnList

let tabList = ref([
  {
    id: 1,
    title: '全部订单'
  },
  {
    id: 2,
    title: '待付款',
    count: 22
  },
  {
    id: 3,
    title: '待收货',
    count: 1
  },
  {
    id: 4,
    title: '待评价',
    count: 100
  }
])
let tabActiveIndex = ref(0)

// 切换头部tab
function clickTabFn(index) {
  tabActiveIndex.value = index
}

let keyword = ref('')
let showMoreFilter = ref(true)
function clickMoreFilter() {
  showMoreFilter.value = !showMoreFilter.value
}
let orderFilterList = reactive([
  {
    title: '订单状态',
    active: 0,
    list: [
      {
        id: 1,
        title: '全部'
      },
      {
        id: 2,
        title: '待付款'
      },
      {
        id: 3,
        title: '待发货'
      },
      {
        id: 4,
        title: '待收货'
      },
      {
        id: 5,
        title: '退款售后'
      },
      {
        id: 6,
        title: '交易完成'
      }
    ]
  },
  {
    title: '付款方式',
    active: 0,
    list: [
      {
        id: 1,
        title: '全部'
      },
      {
        id: 2,
        title: '零钱'
      },
      {
        id: 3,
        title: '微信'
      },
      {
        id: 4,
        title: '支付宝'
      },
      {
        id: 5,
        title: '线下支付'
      }
    ]
  },
  {
    title: '发票抬头类型',
    active: 0,
    list: [
      {
        id: 1,
        title: '全部'
      },
      {
        id: 2,
        title: '个人'
      },
      {
        id: 3,
        title: '企业'
      }
    ]
  }
])
function closeMoreFilter() {
  showMoreFilter.value = false
}
function clickFilterLi(index, subIndex) {
  if (orderFilterList[index].active === subIndex) return
  orderFilterList[index].active = subIndex
}
// 订单列表
let tableData = [
  {
    id: 1,
    mainpic: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
    title: '商品名称',
    pricetitle: '规格',
    price: '5.00',
    count: 6,
    unit: '个',
    totalPrice: '30.00',
    status: 0
  },
  {
    id: 2,
    mainpic: 'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
    title: '商品名称商品名称商品名称商品名称',
    pricetitle: '规格规格规格规格规格',
    price: '12.00',
    count: 5,
    unit: '只',
    totalPrice: '60.00',
    status: 1
  }
]
// 表格操作按钮 @click.prevent="deleteRow(scope.$index, scope.row)"
// function deleteRow(index, row) {
//   console.log(index, row.title)
// }
</script>

<style scoped lang="less">
.main-part {
  .search-part {
    margin-bottom: 10px;
    .search-enter {
      white-space: nowrap;
      .more-filter {
        margin-left: 20px;
        cursor: pointer;
        font-size: 13px;
        padding: 2px 9px 2px 6px;
        border-radius: 4px;
        border: 1px solid @border-line-color;
        .el-icon {
          margin-left: 5%;
          transition: 0.2s;
          &.rotate {
            transform: rotate(180deg);
          }
        }
      }
    }
  }
  .filter-more {
    position: relative;
    padding: 8px 0 5px;
    font-size: 12px;
    border-top: 1px solid @border-line-color;
    .el-icon {
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
    .per-filter {
      margin-bottom: 10px;
      .left-name {
        height: 26px;
        line-height: 26px;
        white-space: nowrap;
      }
      .right-con {
        li {
          cursor: pointer;
          border-radius: 3px;
          margin-right: 2px;
          padding: 4px 8px;
          &.active,
          &:hover {
            color: #fff;
            background-color: @primary-color;
          }
        }
      }
    }
  }
  .order-part {
    background-color: @bg-gray-color;
    min-height: 300px;
    margin-top: 12px;
    .el-table {
      .red-column {
        color: @danger-color;
      }
      .orange-style {
        color: @orange-color;
      }
      .operate-btn {
        width: 74px;
        height: 28px;
        line-height: 28px;
        border-radius: 4px;
        font-size: 13px;
        cursor: pointer;
        margin: 5px 0;
        &.btn1 {
          color: #fff;
          background-color: @danger-color;
        }
        &.btn2 {
          color: @danger-color;
          border: 1px solid @danger-color;
        }
        &.btn3 {
          color: #fff;
          background-color: @primary-color;
        }
        &.btn4 {
          color: @primary-color;
          border: 1px solid @primary-color;
        }
      }
    }
  }
}
</style>
