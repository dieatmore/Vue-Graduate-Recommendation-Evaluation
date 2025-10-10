import { useGet, usePatch } from '@/axios'
import { useUserStore } from '@/stores/UserStore'
import type { Userx } from '@/types'

const userStore = useUserStore()

// 搜索学院（名称）
export const getCollegeService = async () => {
  return await useGet(`collegeadmin/college`)
}

// 修改密码
export const updatePasswordService = async (password: Userx) => {
  return await usePatch(`collegeadmin/password`, password)
}

// 修改个人信息
export const updateUserInfoService = async (user: Userx) => {
  const data = await usePatch(`collegeadmin/userinfo`, user)
  userStore.setUser(data)
  return userStore.UserS
}
