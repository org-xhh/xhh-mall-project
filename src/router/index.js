import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home.vue'

// nginx
// location / {
//   try_files $uri $uri/ /index.html;
// }
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: () => import('../views/login')
    },
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      meta: {
        title: '首页'
      },
      component: HomeView // 首页不需要懒加载，否则慢

      // lazy-loaded when the route is visited.
      // component: () => import('../views/home.vue')
      // alias: '/' // 用户访问 / 时，URL 仍然是 /，但会被匹配为用户正在访问 /home
    },
    {
      path: '/goodsDetail',
      name: 'goodsDetail',
      meta: {
        title: '商品详情'
      },
      component: () => import('../views/goodsDetail.vue')
    },
    {
      path: '/shopCart',
      name: 'shopCart',
      meta: {
        title: '购物车'
      },
      component: () => import('../views/shopCart')
    },
    {
      path: '/confirmOrder',
      name: 'confirmOrder',
      meta: {
        title: '确认订单'
      },
      component: () => import('../views/confirmOrder')
    },
    {
      path: '/orderPayment',
      name: 'orderPayment',
      meta: {
        title: '订单支付'
      },
      component: () => import('../views/orderPayment')
    },
    {
      path: '/userCenter/:origin',
      name: 'userCenter',
      meta: {
        title: ''
      },
      component: () => import('../views/userCenter')
    },
    {
      path: '/waterfallPage',
      name: 'waterfallPage',
      meta: {
        title: '瀑布流'
      },
      component: () => import('../views/waterfallPage')
    },
    // {
    //   path: '/notFound',
    //   meta: {
    //     title: 'notFound'
    //   },
    //   component: () => import('../views/notFound.vue')
    // },
    {
      path: '/:pathMatch(.*)*',
      meta: {
        title: 'notFound'
      },
      component: () => import('../views/notFound.vue')
    }
  ],
  scrollBehavior: () => {
    // 新开页面滚动条回到顶部
    return { top: 0 }
  }
})

export default router
