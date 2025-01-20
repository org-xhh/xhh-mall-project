const handleThrottle = {
  mounted(el, binding) {
    let value = binding.value || []
    let eventType = value[0] || 'click' // 默认click事件
    let throttleTime = value[1] || 1000 // 若不设置防抖时间，默认1s

    let cbFun
    el.addEventListener(
      eventType,
      (event) => {
        if (!cbFun) {
          // 第一次执行
          cbFun = setTimeout(() => {
            cbFun = null
          }, throttleTime)
        } else {
          event && event.stopImmediatePropagation()
        }
      },
      true
    )
  }
}

import { throttle, debounce, trimFn } from '@web-xhh/web-utils'
// 一个页面只能绑一个，不然同时会挂载多个dom
const eventThrottle = {
  mounted(el, binding) {
    let executeFunction
    if (binding.value instanceof Array) {
      const value = binding.value
      let func = value[0]
      let timer = value[1] || 500
      let isImmediate = value[2]
      isImmediate = isImmediate === '' || isImmediate === undefined ? true : isImmediate
      executeFunction = throttle(func, timer, isImmediate)

      let eventType = value[3] || 'click'
      el.addEventListener(eventType, executeFunction)
    } else {
      console.error(`throttle指令绑定的参数必须是数组`)
      return
    }
  }
}

const eventDebounce = {
  mounted(el, binding) {
    let executeFunction
    if (binding.value instanceof Array) {
      const value = binding.value
      let func = value[0]
      let timer = value[1] || 500
      let isImmediate = value[2]
      isImmediate = isImmediate === '' || isImmediate === undefined ? true : isImmediate
      executeFunction = debounce(func, timer, isImmediate)

      let eventType = value[3] || 'click'
      el.addEventListener(eventType, executeFunction)
    } else {
      console.error(`debounce指令绑定的参数必须是数组`)
      return
    }
  }
}

// 去除空格
const trimStr = {
  // eslint-disable-next-line no-unused-vars
  mounted(el, binding, vnode) {
    let inputEl =
      (el.getElementsByClassName('el-input__inner') && el.getElementsByClassName('el-input__inner')[0]) || {}
    // 解决中文输入双向绑定失效问题
    // inputEl.addEventListener('compositionstart', () => {
    //   vnode.locking = true
    // })
    // inputEl.addEventListener('compositionend', () => {
    //   vnode.locking = false
    // })
    inputEl.addEventListener(
      'keyup',
      () => {
        // if (vnode.locking) {
        //   return
        // }
        const value = inputEl.value
        let pos = (binding.value && binding.value[0]) || ''

        inputEl.value = trimFn(value, pos)

        inputEl.dispatchEvent(new Event('input'))
      },
      false
    )
  }
}

export function commonDirective(app) {
  app.directive('throttle', handleThrottle)
  app.directive('eventThrottle', eventThrottle)
  app.directive('eventDebounce', eventDebounce)
  app.directive('trimStr', trimStr)
}
