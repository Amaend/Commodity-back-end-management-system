import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/components/loginIndex.vue'),
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('@/components/homeIndex.vue'),
    children: [
      {
        path: 'users',
        name: 'user',
        component: () => import('@/views/user/uesrIndex.vue'),
        meta: {
          flage: true,
        },
      },
      {
        path: 'roles',
        name: 'role',
        component: () => import('@/views/role/roleIndex.vue'),
        meta: {
          flage: true,
        },
      },
      {
        path: 'rights',
        name: 'rights',
        component: () => import('@/views/role/rightIndex.vue'),
        meta: {
          flage: true,
        },
      },
      {
        path: 'goods',
        name: 'goods',
        component: () => import('@/views/goods/goodsIndex.vue'),
        meta: {
          flage: true,
        },
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/views/goods/cateIndex.vue'),
        meta: {
          flage: true,
        },
      },
      {
        path: 'params',
        name: 'params',
        component: () => import('@/views/goods/paramsIndex.vue'),
        meta: {
          flage: true,
        },
      },
      {
        path: 'goods/add',
        name: 'add',
        component: () => import('@/views/goods/addGoodsIndex.vue'),
        meta: {
          flage: true,
        },
      },
      {
        path: 'orders',
        name: 'orders',
        component: () => import('@/views/order/orderIndex.vue'),
        meta: {
          flage: true,
        },
      },
      {
        path: 'reports',
        name: 'reports',
        component: () => import('@/views/reports/reportIndex'),
        meta: {
          flage: true,
        },
      },
    ],
  },
  {
    path: '/aside',
    name: 'aside',
    component: () => import('@/components/asideIndex.vue'),
  },
  {
    path: '/',
    redirect: '/home',
  },
]

const router = new VueRouter({
  routes,
})
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('token')
  if (!token && to.name !== 'login') {
    next('/login')
  } else {
    next()
  }
})
export default router
