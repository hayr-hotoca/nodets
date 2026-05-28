import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import DivisionListView from '../views/division/DivisionListView.vue'
import DivisionFormView from '../views/division/DivisionFormView.vue'
import GRNFormView from '../views/grn/GRNFormView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/division'
  },
  {
    path: '/division',
    name: 'DivisionList',
    component: DivisionListView,
    meta: { title: 'Danh sách Bộ phận' }
  },
  {
    path: '/division/new',
    name: 'DivisionForm',
    component: DivisionFormView,
    meta: { title: 'Thêm Bộ phận' }
  },
  {
    path: '/goods-received-note',
    name: 'GoodsReceivedNote',
    component: GRNFormView,
    meta: { title: 'Phiếu Nhập Kho' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || 'Hệ thống Quản lý'
  next()
})

export default router
