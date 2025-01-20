// 需求：一定时间内不操作页面，页面失效
// 切换页面 setInterval会停止计时，web worker不会
let timer = null
// console.log(self === this) // true DedicatedWorkerGlobalScope
self.addEventListener('message', (e) => {
  console.log(e.data) // 接收主线程发送的消息

  let sum = 0
  let msg

  if (e.data === 'start') {
    timer = setInterval(() => {
      sum += 1
      msg = { sum }
      self.postMessage(msg)
    }, 1000)
  } else if (e.data === 'end') {
    clearInterval(timer)
    timer = null
  }
})