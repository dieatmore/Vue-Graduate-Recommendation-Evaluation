import { Role } from '@/types'
import { ref, type Ref } from 'vue'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/views/login/LoginView.vue')
  },
  {
    path: '/Admin',
    component: () => import('@/views/main/Admin/IndexView.vue'),
    redirect: '/college',
    meta: { role: Role.ADMIN },
    children: [
      {
        path: '/college',
        component: () => import('@/views/main/Admin/CollegeView.vue')
      },
      {
        path: '/Admininfo',
        component: () => import('@/views/main/Admin/AdminInfo.vue')
      }
    ]
  },
  {
    path: '/CollegeAdmin',
    component: () => import('@/views/main/CollegeAdmin/IndexView.vue'),
    redirect: '/category',
    meta: { role: Role.COLLAGE_ADMIN },
    children: [
      {
        path: '/category',
        component: () => import('@/views/main/CollegeAdmin/CategoryView.vue')
      },
      {
        path: '/categorys/:categoryId/managemajors',
        component: () => import('@/views/main/CollegeAdmin/MajorView.vue')
      },
      {
        path: '/teachermanage',
        component: () => import('@/views/main/CollegeAdmin/TeacherView.vue')
      },
      {
        path: '/students/:studentId',
        component: () => import('@/views/main/CollegeAdmin/StudentDetail.vue')
      },
      {
        path: '/categorys/:categoryId/noderules',
        component: () => import('@/views/main/CollegeAdmin/NodeRule.vue')
      },
      {
        path: '/categorys/:categoryId/markmajors/:majorId/markstudents',
        component: () => import('@/views/main/CollegeAdmin/MarkStudent.vue')
      },
      {
        path: '/resetpassword',
        component: () => import('@/views/main/CollegeAdmin/ResetPassword.vue')
      },
      {
        path: '/userinfo',
        component: () => import('@/views/main/CollegeAdmin/UserInfo.vue')
      }
    ]
  },
  {
    path: '/Student',
    component: () => import('@/views/main/Student/IndexView.vue'),
    redirect: () => '/studentinfo',
    meta: { role: Role.STUDENT },
    children: [
      {
        path: '/rootnodes/:nodeId/nodes',
        component: () => import('@/views/main/Student/SubmitView.vue')
      },
      {
        path: '/studentinfo',
        component: () => import('@/views/main/Student/StudentInfo.vue')
      },
      {
        path: '/filedialog',
        component: () => import('@/views/main/Student/FileDialog.vue')
      }
    ]
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

const firstId = ref('')
export default router
export const redirectService = (pathsR: Ref) => {
  if (pathsR.value && pathsR.value.length > 0) {
    firstId.value = pathsR.value[0].id
  }
}
