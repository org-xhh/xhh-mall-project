// 订单状态
export const orderStatusTxt = (val) => {
  if (val.status === 0) {
    return '待付款'
  } else if (val.status === 1) {
    return '待收货'
  }
}

// 订单操作按钮
export const orderStatusBtnList = (val) => {
  let btnList = []
  if (val.status === 0) {
    btnList.push({
      btnTxt: '立即支付',
      btnStatus: 1
    })
    btnList.push({
      btnTxt: '取消订单',
      btnStatus: 2
    })
  } else if (val.status === 1) {
    btnList.push({
      btnTxt: '确认收货',
      btnStatus: 3
    })
    btnList.push({
      btnTxt: '申请退款',
      btnStatus: 4
    })
  }
  return btnList
}
