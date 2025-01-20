import './assets/main.css'

import { createApp } from 'vue'

// 完整引入
// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { commonDirective } from '@/utils/directive'
import VueLazyload from 'vue-lazyload' // 引入懒加载插件
import '@/permission'

const app = createApp(App)

// element-plus svg图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(createPinia())

// 注册全局节流指令
commonDirective(app)

// app.use(ElementPlus)
app.config.errorHandler = (err, vm, info) => {
  // 处理错误
  console.error('errorHandler:', err, vm, info)
}

import { resize } from '@/utils/resize'
app.config.globalProperties.$resize = resize

import VueQrcode from 'vue-qrcode'
app.component('vue-qrcode', VueQrcode)
app.mount('#app')

app.use(VueLazyload, {
  preload: 1, // 预加载高度的比例
  error: '', // 图片加载失败时的默认图片
  loading: '', // 图像正在加载时的loadding图片
  attempt: 2 // 尝试次数
})

import 'element-plus/es/components/message/style/css' // ElMessage 样式

// 路由懒加载，更新代码后重新打包，路由404问题解决
window.addEventListener('vite:preloadError', () => {
  console.log('preloadError 检测到新版本')
  setTimeout(() => {
    window.location.reload()
    console.log('页面已更新')
  }, 5000)
})
