import { Role } from '@/types'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/login/LoginView.vue')
  },
  {
    path: '/admin',
    component: () => import('@/views/Admin/IndexView.vue'),
    redirect: '/college',
    meta: { role: Role.ADMIN },
    children: [
      {
        path: '/college',
        component: () => import('@/views/Admin/CollegeView.vue')
      },
      {
        path: '/test',
        component: () => import('@/views/Admin/TestView.vue')
      }
    ]
  },
  {
    path: '/collegeadmin',
    component: () => import('@/views/CollegeAdmin/IndexView.vue'),
    meta: { role: Role.COLLAGE_ADMIN }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 添加全局前置守卫
router.beforeEach(to => {
  // 排除，没有声明角色权限的路由
  if (!to.meta.role) {
    return true
  }
  if (to.meta.role == sessionStorage.getItem('role')) {
    return true
  }
  sessionStorage.clear()
  return '/'
})

export default router
