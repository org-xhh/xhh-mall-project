// document.addEventListener('DOMContentLoaded', function () {
let liMarginRight = 0
let initUlWidth = 0 // 初始ul宽度
let maxScrollX = 0 // 滚动到右边某个位置重新计算位置
let currentX = 0
let requestId = null
let mouseDownX = 0 // 拖拽初始X
let seamlessUl = document.getElementsByClassName('seamless-ul')[0]
let seamlessWrap = document.getElementsByClassName('seamless-wrap')[0]

function start(obj) {
  liMarginRight = obj.liMarginRight || 15
  initUlWidth = 0
  seamlessUl = document.getElementsByClassName('seamless-ul')[0]
  seamlessWrap = document.getElementsByClassName('seamless-wrap')[0]
  // 准备工作：添加前后dom
  addBeforeAfterDom()
  // 开始无缝滚动
  initScrollFn()
}

function addBeforeAfterDom() {
  let firstLi = seamlessUl.getElementsByTagName('li')[0]

  let seamlessUlChild = seamlessUl.cloneNode(true).children
  // test start
  // 标识，滚动展示页面上原有的一组li，暂时没用到
  // firstLi.classList.add('first-li')
  // firstLi.style.backgroundColor = '#666'
  // seamlessUl.getElementsByTagName('li')[1].style.backgroundColor = '#666'
  // seamlessUl.getElementsByTagName('li')[2].style.backgroundColor = '#666'
  // seamlessUl.getElementsByTagName('li')[3].style.backgroundColor = '#666'
  // seamlessUl.getElementsByTagName('li')[4].style.backgroundColor = '#666'
  // seamlessUl.getElementsByTagName('li')[5].style.backgroundColor = '#666'
  // test end

  // 获取初始ul宽度
  for (let i = 0; i < seamlessUl.children.length; i++) {
    initUlWidth += seamlessUl.children[i].offsetWidth + liMarginRight // 630
    maxScrollX = initUlWidth * 2 // 1260
  }

  // 复制li到dom前面
  for (let i = 0; i < seamlessUlChild.length; i++) {
    seamlessUl.insertBefore(seamlessUlChild[i].cloneNode(true), firstLi)
  }
  // 复制li到dom后面
  for (let i = 0; i < seamlessUlChild.length; i++) {
    seamlessUl.appendChild(seamlessUlChild[i].cloneNode(true))
  }
  seamlessUl.style.width = initUlWidth * 3 + 'px'
}
function initScrollFn() {
  // 初始位置
  currentX = initUlWidth
  seamlessUl.style.transform = `translate3d(-${currentX}px, 0px, 0px)`

  // 滚动函数
  scrollFn()

  // 鼠标移入暂停
  eleMouseEnterFn()

  // 拖拽
  ulMouseDragFn()
}
function scrollFn() {
  currentX++
  if (currentX >= maxScrollX) {
    currentX = initUlWidth
  }
  seamlessUl.style.transform = `translate3d(-${currentX}px, 0px, 0px)`

  requestId = window.requestAnimationFrame(scrollFn)
}
function eleMouseEnterFn() {
  // 鼠标移入暂停滚动
  seamlessWrap.addEventListener('mouseenter', function () {
    requestId && window.cancelAnimationFrame(requestId)
  })
  // 鼠标移出继续滚动
  seamlessWrap.addEventListener('mouseleave', function () {
    requestId = window.requestAnimationFrame(scrollFn)
  })
}
// 拖拽
function ulMouseDragFn() {
  seamlessUl.addEventListener('mousedown', mousedownFn)
  seamlessWrap.addEventListener('mouseleave', function () {
    // 如果沒有触发mouseUp事件
    seamlessUl.removeEventListener('mousemove', mousemoveFn)
  })

  function mousedownFn(e) {
    mouseDownX = e.clientX
    // console.log('鼠标按下X', mouseDownX)
    seamlessUl.addEventListener('mousemove', mousemoveFn)
    seamlessUl.addEventListener('mouseup', mouseupFn)
  }
  function mousemoveFn(e) {
    let moveClientX = e.clientX
    // console.log('鼠标移动X', moveClientX)
    if (moveClientX < mouseDownX) {
      // console.log('向左')
      // 向左移动
      let moveDistance = Math.abs(moveClientX - mouseDownX)
      mouseDownX = moveClientX
      currentX = currentX + moveDistance
      // 右边到头（初始ul右侧）
      if (currentX >= maxScrollX) {
        currentX = initUlWidth
      }
      seamlessUl.style.transform = `translate3d(-${currentX}px, 0px, 0px)`
    } else if (moveClientX > mouseDownX) {
      // console.log('向右')
      // 向右移动
      let moveDistance = Math.abs(moveClientX - mouseDownX)
      mouseDownX = moveClientX
      currentX = currentX - moveDistance
      // 左边到头（初始ul左侧）
      if (currentX <= initUlWidth) {
        currentX = maxScrollX
      }
      seamlessUl.style.transform = `translate3d(-${currentX}px, 0px, 0px)`
    }
  }
  function mouseupFn() {
    seamlessUl.removeEventListener('mousemove', mousemoveFn)
  }
}
function destroy() {
  requestId && window.cancelAnimationFrame(requestId)
}

const seamLessObj = {
  start,
  destroy
}
export default seamLessObj
// })
