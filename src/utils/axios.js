import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '@/router'
import { useLoadingStore } from '@/store/axiosLoading'

axios.defaults.baseURL = import.meta.env.VITE_BASE_API_URL
// 跨域请求携带cookie设置（同域默认携带）
// axios.defaults.headers.withCredentials = true
// 请求头配置
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// 默认超时时间
axios.defaults.timeout = 30 * 1000

// 声明一个数组用于存储每个请求的取消函数和axios标识
let pending = []
let CancelTokenVal = axios.CancelToken
let removePending = (config) => {
  for (let p in pending) {
    if (pending[p].u === config.url.split('?')[0] + '&' + config.method) {
      // 实际上发到服务端了没有取消
      pending[p].f('取消的接口地址:' + config.url)
      pending.splice(p, 1)
    }
  }
}

axios.interceptors.request.use(
  (config) => {
    removePending(config) // 在一个axios发送前执行一下取消操作
    // 目前对两次请求判定重复的标准是  url和请求方式相同并在很短的时间内请求多次
    config.cancelToken = new CancelTokenVal((c) => {
      // pending存放每一次请求的标识
      pending.push({ u: config.url.split('?')[0] + '&' + config.method, f: c })
    })

    // config.headers.token = ''

    // loading
    let loadingStore = useLoadingStore()
    loadingStore.setPageLoading(true)

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    // loading
    let loadingStore = useLoadingStore()
    loadingStore.setPageLoading(false)

    let res = response.data || {}
    if (~response.config.url.indexOf('china-all') || ~response.config.url.indexOf('version.json')) {
      return res
    }
    if (res.code !== 200) {
      if (res.code <= 10) {
        router.replace({ path: '/login' })
      } else {
        ElMessage.error('服务端异常！')
        return Promise.reject(res)
      }
    } else {
      return res
    }
  },
  (error) => {
    // loading
    let loadingStore = useLoadingStore()
    loadingStore.setPageLoading(false)

    if (error.response) {
      if (error.response.status === 401) {
        router.replace({ path: '/login' })
        return
      }
      if (error.response.status === 403) {
        ElMessage.error('您没有权限！')
        return Promise.reject(error)
      }
      if (error.response.status === 404) {
        ElMessage.error('Not Found！')
        return Promise.reject(error)
      }
    }
    // 通过总入口做防抖处理,手动杀死的请求不进行报错处理
    if (!axios.isCancel(error)) {
      ElMessage.error('网络请求失败，请稍后重试！')
    }
    return Promise.reject(error)
  }
)

export default axios
