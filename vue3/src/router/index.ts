import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../modules/auth/stores/useAuthStore'
import LoginView from '../modules/auth/views/LoginView.vue'
import DivisionListView from '../modules/division/views/DivisionListView.vue'
import DivisionFormView from '../modules/division/views/DivisionFormView.vue'
import GRNFormView from '../modules/goods-received-note/views/GRNFormView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: 'Đăng nhập', requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/division'
  },
  {
    path: '/division',
    name: 'DivisionList',
    component: DivisionListView,
    meta: { title: 'Danh sách Bộ phận', requiresAuth: true }
  },
  {
    path: '/division/new',
    name: 'DivisionForm',
    component: DivisionFormView,
    meta: { title: 'Thêm Bộ phận', requiresAuth: true }
  },
  {
    path: '/goods-received-note',
    name: 'GoodsReceivedNote',
    component: GRNFormView,
    meta: { title: 'Phiếu Nhập Kho', requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  document.title = (to.meta.title as string) || 'Hệ thống Quản lý'

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
