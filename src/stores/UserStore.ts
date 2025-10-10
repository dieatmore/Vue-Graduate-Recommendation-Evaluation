import type { Userx } from '@/types'
import { shallowRef } from 'vue'

const UserS = shallowRef<Userx>()
const clear = () => (UserS.value = undefined)

// 持久存储会话方法
const setUser = (user: Userx) => {
  sessionStorage.setItem('user', JSON.stringify(user))
}

const user = sessionStorage.getItem('user')

if (user) UserS.value = JSON.parse(user)

const store = { UserS, clear, setUser }

export const useUserStore = () => store
