import axios from '@/axios'
import { useMessage } from '@/components/message'
import router from '@/router'
// import { useUserStore } from '@/stores/UserStore'
import { Role, type ResultVO, type Userx } from '@/types'

const message = useMessage()

export const loginService = async (user: Userx) => {
  let path = null
  try {
    const resp = await axios.post<ResultVO>('open/login', user)
    const data = resp.data.data
    const token = resp.headers.token
    let role = resp.headers.role
    if (!data || !token || !role) {
      message.error('登录错误')
    }
    sessionStorage.setItem('token', token)

    // to do 用户信息存储
    // userStore.setUser(data)
    // userStore.UserS.value = data

    if (role === Role.ADMIN) {
      path = '/admin'
    }
    sessionStorage.setItem('role', role)
  } catch (err: any) {
    message.error(err)
  } finally {
    path && router.push(path)
  }
}
