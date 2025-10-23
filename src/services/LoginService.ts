import axios, { useGet, usePost } from '@/axios'
import { useMessage } from '@/components/message'
import router from '@/router'
import { useUserStore } from '@/stores/UserStore'
import { Role, type ResultVO, type Userx } from '@/types'
import queryClient from '@/vuequery'
import { useQuery } from '@tanstack/vue-query'
import { querycachename } from './Const'

const message = useMessage()
const userStore = useUserStore()

// 登录请求
export const loginService = async (user: Userx) => {
  let path = null
  try {
    const resp = await axios.post<ResultVO>('open/login', user)
    const data = resp.data.data
    const token = resp.headers.token
    const role = resp.headers.role
    if (!data || !token || !role) {
      message.error('登录错误')
    }
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('role', role)
    userStore.setUser(data)
    userStore.UserS.value = data
    if (role === Role.ADMIN) {
      path = '/admin'
    } else if (role === Role.COLLAGE_ADMIN) {
      path = '/collegeadmin'
    } else if (role === Role.TEACHER) {
      path = '/teacher'
    } else if (role === Role.STUDENT) {
      path = '/student'
    }
  } catch (err: any) {
    message.error(err)
  } finally {
    if (path) router.push(path)
  }
}

// 注册:获取所有学院和专业
export const CollegesAndMajorsService = () => {
  return useQuery({
    queryKey: [querycachename.college.categoriesmajors],
    queryFn: () => useGet('open/register/collegesmajors')
  })
}

// 学生注册
export const RegisterService = async (user: Userx) => {
  return await usePost('open/register', user)
}

// 退出登录
export const LogoutService = () => {
  sessionStorage.clear()
  userStore.clear()
  queryClient.removeQueries()
  router.replace('/')
}
