import router from '@/router'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
NProgress.configure({ showSpinner: false }) // 进度条
import axios from '@/utils/axios'

const whiteList = ['/login', '/home']

import { queryParams } from '@web-xhh/web-utils'

router.beforeEach(async (to, from, next) => {
  // 是否上传了新版本
  await versionIsUpdate()

  NProgress.start()
  const hasToken = localStorage.getItem('xhhToken')
  document.title = to.meta.title || 'xhh-mall-project'
  // if (to.matched.length === 0) {
  //   next('/notFound')
  // } else {
  if (hasToken) {
    if (to.path === '/login') {
      next('/home')
    } else {
      next()
    }
  } else {
    if (~whiteList.indexOf(to.path)) {
      // 放行
      next()
    } else {
      let urlParams = queryParams(to.query)
      // 中断当前导航，执行新的导航
      next(`/login?pageRedirect=${to.path}${urlParams}`)
    }
  }
  // }
})

const versionIsUpdate = async () => {
  if (process.env.NODE_ENV === 'production') {
    const response = await axios.get(`//${window.location.host}/xhh-mall-project/version.json`)
    // console.log('版本比较', __PROJECT_VERSION__, response.version)
    // 发布新版，页面刷新前__PROJECT_VERSION__是上个版本的version，response.version是最新打包的version
    if (__PROJECT_VERSION__ !== response.version) {
      console.log('检测到有新版本')
      setTimeout(() => {
        window.location.reload()
      })
    }
  }
}

router.afterEach(() => {
  NProgress.done()
})
