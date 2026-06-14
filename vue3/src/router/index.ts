import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../modules/auth/stores/useAuthStore'
import LoginView from '../modules/auth/views/LoginView.vue'

// Auto-load all view components using import.meta.glob
const viewModules = import.meta.glob('../modules/**/views/*.vue')
// ../modules/auth/views/LoginView.vue: () => {…}
// ../modules/dashboard/views/DashboardView.vue: () => {…}
// ../modules/division/views/DivisionFormView.vue: () => {…}
// ../modules/division/views/DivisionListView.vue: () => {…}
// ../modules/goods-received-note/views/GRNFormView.vue: () => {…}
// ../modules/product/views/ProductListView.vue: () => {…}
// ../modules/unit/views/UnitListView.vue: () => {…}
// ../modules/warehouse/views/WarehouseListView.vue: () => {…}

// Auto-generate routes from loaded components
const autoRoutes: RouteRecordRaw[] = Object.entries(viewModules).map(
  ([path, component]) => {
    // Extract module name and view name from file path
    // Example path: '../modules/division/views/DivisionListView.vue'
    const pathParts = path.split('/')
    const moduleName = pathParts[pathParts.length - 3]
    const fileName = pathParts[pathParts.length - 1]
    const viewName = fileName.replace('View.vue', '')

    // Generate route path based on module and view name
    let routePath = `/${moduleName}`
    if (!viewName.toLowerCase().includes('list') && !viewName.toLowerCase().includes('dashboard')) {
      // For non-list, non-dashboard views, add the view name to path (e.g., /division/new)
      routePath += `/${viewName.toLowerCase()}`
    }

    // Generate route name from module and view
    const routeName = `${moduleName}-${viewName}`

    return {
      path: routePath,
      name: routeName,
      component: component,
      meta: { 
        title: `${viewName.replace(/([A-Z])/g, ' $1').trim()} - ${moduleName}`, 
        requiresAuth: moduleName !== 'auth' 
      }
    }
  }
)

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { title: 'Đăng nhập', requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  // Include auto-generated routes
  ...autoRoutes
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

console.log('🚀 Auto-generated routes:', routes)

export default router
