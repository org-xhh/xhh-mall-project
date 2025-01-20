let perLiWidth = 0
let initLiLen = 0 // 8
let currentIndex = 0 // 8
let maxScrollLen = 0 // 16

let timerInterVal = null
let startX = 0 // 拖拽初始X
let carouselUl = null
let carouselWrap = null
let isMouseUp = true

let obj = {}

function start(params) {
  obj = params
  carouselUl = document.getElementsByClassName('carousel-ul')[0]
  carouselWrap = document.getElementsByClassName('carousel-drag-wrap')[0]
  // 准备工作：添加前后dom
  addBeforeAfterDom()
  // 开始无缝滚动
  startCarouselScroll()
}

function addBeforeAfterDom() {
  let firstLi = carouselUl.getElementsByTagName('li')[0]

  let carouselUlChild = carouselUl.cloneNode(true).children
  // test start
  // 标识，滚动展示页面上原有的一组li，暂时没用到
  // firstLi.classList.add('first-li')
  // firstLi.style.backgroundColor = '#888'
  // carouselUl.getElementsByTagName('li')[1].style.backgroundColor = '#888'
  // carouselUl.getElementsByTagName('li')[2].style.backgroundColor = '#888'
  // carouselUl.getElementsByTagName('li')[3].style.backgroundColor = '#888'
  // carouselUl.getElementsByTagName('li')[4].style.backgroundColor = '#888'
  // carouselUl.getElementsByTagName('li')[5].style.backgroundColor = '#888'
  // test end

  // 每次滚动一个li的宽度
  perLiWidth = carouselUl.children[0].offsetWidth // 220
  initLiLen = carouselUl.children.length
  currentIndex = initLiLen
  maxScrollLen = initLiLen * 2

  // 前面补一组
  for (let i = 0; i < carouselUlChild.length; i++) {
    carouselUl.insertBefore(carouselUlChild[i].cloneNode(true), firstLi)
  }
  // 后面补一组
  for (let i = 0; i < carouselUlChild.length; i++) {
    carouselUl.appendChild(carouselUlChild[i].cloneNode(true))
  }

  // 指定ul宽度
  carouselUl.style.width = perLiWidth * initLiLen * 3 + 'px'
}
function startCarouselScroll() {
  // 初始位置
  carouselUl.style.transform = `translate3d(-${currentIndex * perLiWidth}px, 0px, 0px)`

  // 滚动函数
  scrollFn()

  // 鼠标移入暂停
  ulMouseEnterFn()

  // 拖拽
  ulDragFn()
}
function scrollFn() {
  timerInterVal && clearInterval(timerInterVal)
  timerInterVal = setInterval(() => {
    next()
  }, obj.time)
}
// 下一张
function next() {
  currentIndex++

  carouselUl.style.transform = `translate3d(-${currentIndex * perLiWidth}px, 0px, 0px)`
  carouselUl.style['transition'] = '-webkit-transform 300ms'

  // 替换第一个li，滚动的都是中间这一组
  if (currentIndex >= maxScrollLen) {
    // 动画结束立马替换
    setTimeout(() => {
      currentIndex = initLiLen

      carouselUl.style['transition'] = '-webkit-transform 0ms'
      carouselUl.style.transform = `translate3d(-${currentIndex * perLiWidth}px, 0px, 0px)`
    }, 300)
  }
}
function ulMouseEnterFn() {
  // 鼠标移入暂停滚动
  carouselWrap.addEventListener('mouseenter', function () {
    timerInterVal && clearInterval(timerInterVal)
  })
  // 鼠标移出继续滚动
  carouselWrap.addEventListener('mouseleave', function () {
    scrollFn()
  })
}
// 拖拽
function ulDragFn() {
  carouselUl.addEventListener('mousedown', mousedownFn)
  carouselWrap.addEventListener('mouseleave', function () {
    // 没有监听到mouseup事件，鼠标出去了
    if (!isMouseUp) {
      currentIndex = judgeCurrent()
      carouselUl.style.transform = `translate3d(-${currentIndex * perLiWidth}px, 0px, 0px)`
      carouselUl.style['transition'] = '-webkit-transform 300ms'
      // 替换第一组的li
      if (currentIndex >= maxScrollLen) {
        setTimeout(() => {
          currentIndex = currentIndex - initLiLen

          carouselUl.style['transition'] = '-webkit-transform 0ms'
          carouselUl.style.transform = `translate3d(-${currentIndex * perLiWidth}px, 0px, 0px)`
        }, 300)
      }
      // 替换最后一组的li
      if (currentIndex < initLiLen) {
        setTimeout(() => {
          currentIndex = currentIndex + initLiLen

          carouselUl.style['transition'] = '-webkit-transform 0ms'
          carouselUl.style.transform = `translate3d(-${currentIndex * perLiWidth}px, 0px, 0px)`
        }, 300)
      }

      carouselUl.removeEventListener('mousemove', mousemoveFn)
    }
  })

  function mousedownFn(e) {
    // 必须加这句话，否则图片拖动不了
    e.preventDefault()

    isMouseUp = false
    timerInterVal && clearInterval(timerInterVal)

    startX = e.pageX
    // console.log('鼠标按下X', startX)
    carouselUl.addEventListener('mousemove', mousemoveFn)
    carouselUl.addEventListener('mouseup', mouseupFn)
  }
  function mousemoveFn(e) {
    let moveX = e.pageX
    let distanceX = Math.abs(moveX - startX)
    if (moveX < startX) {
      // 向左
      carouselUl.style['transition'] = '-webkit-transform 0ms'
      carouselUl.style.transform = `translate3d(-${currentIndex * perLiWidth + distanceX}px, 0px, 0px)`
    } else if (moveX > startX) {
      // 向右
      carouselUl.style['transition'] = '-webkit-transform 0ms'
      carouselUl.style.transform = `translate3d(-${currentIndex * perLiWidth - distanceX}px, 0px, 0px)`
    }
  }
  function mouseupFn(e) {
    isMouseUp = true
    currentIndex = judgeCurrent()
    console.log(currentIndex)
    let endX = e.pageX
    if (endX < startX) {
      // console.log('向左拖拽')

      carouselUl.style.transform = `translate3d(-${currentIndex * perLiWidth}px, 0px, 0px)`
      carouselUl.style['transition'] = '-webkit-transform 300ms'

      carouselUl.removeEventListener('mousemove', mousemoveFn)

      if (currentIndex >= maxScrollLen) {
        setTimeout(() => {
          currentIndex = currentIndex - initLiLen

          carouselUl.style['transition'] = '-webkit-transform 0ms'
          carouselUl.style.transform = `translate3d(-${currentIndex * perLiWidth}px, 0px, 0px)`
        }, 300)
      }
    } else if (endX > startX) {
      // console.log('向右拖拽')
      // 向右移动
      carouselUl.style.transform = `translate3d(-${currentIndex * perLiWidth}px, 0px, 0px)`
      carouselUl.style['transition'] = '-webkit-transform 300ms'

      carouselUl.removeEventListener('mousemove', mousemoveFn)

      if (currentIndex < initLiLen) {
        setTimeout(() => {
          currentIndex = currentIndex + initLiLen

          carouselUl.style['transition'] = '-webkit-transform 0ms'
          carouselUl.style.transform = `translate3d(-${currentIndex * perLiWidth}px, 0px, 0px)`
        }, 300)
      }
    }
  }
  // 判断拖动停下后在哪个li上
  function judgeCurrent() {
    let currentIndex = 0
    let endWhichLiX = getTranslate3dX(carouselUl.style.transform) / perLiWidth
    let xInter = Math.abs(('' + endWhichLiX).split('.')[0]) // 停在第几个li
    let xPoint = ('' + endWhichLiX).split('.')[1] && ('' + endWhichLiX).split('.')[1][0] // 和0.5比较
    // 靠左就停在前一个li，靠右就停在后一个li
    if (xPoint > 5) {
      currentIndex = xInter + 1
    } else {
      currentIndex = xInter
    }
    return currentIndex
  }
  // 获取 translate3d X 的值
  function getTranslate3dX(transformStr) {
    const matches = /translate3d\((-?\d+(?:\.\d+)?)px, .*, .*\)/i.exec(transformStr)
    return matches ? parseFloat(matches[1]) : null
  }
}
function destroy() {
  timerInterVal && clearInterval(timerInterVal)
}

const carouselDragObj = {
  start,
  destroy
}
export default carouselDragObj
