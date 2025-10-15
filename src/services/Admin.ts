import { useDelete, useGet, usePatch, usePost } from '@/axios'
import { useUserStore } from '@/stores/UserStore'
import type { College, Userx } from '@/types'

const userStore = useUserStore()

// 管理员获取所有学院和学院管理员
const CollegesAndAdminsService = async () => {
  return await useGet('admin/collegesadmins')
}

// 搜索学院（名称）
const SearchCollegeService = async (collegeName: string) => {
  return await useGet(`admin/collegesadmins/${collegeName}`)
}

// 添加学院
const addCollegeService = async (data: College) => {
  return await usePost('admin/colleges', data)
}

// 修改学院
const editCollegeService = async (id: string, data: College) => {
  return await usePatch(`admin/colleges/${id}`, data)
}

// 删除学院
const deleteCollegeService = async (id: string) => {
  return await useDelete(`admin/colleges/${id}`)
}

// 添加学院管理员
const addCollegeAdminService = async (id: string, data: Userx) => {
  return await usePost(`admin/colleges/${id}`, data)
}

// 修改学院管理员
const editCollegeAdminService = async (id: string, data: Userx) => {
  return await usePatch(`admin/users/${id}`, data)
}

// 删除学院管理员
const deleteCollegeAdminService = async (id: string) => {
  return await useDelete(`admin/users/${id}`)
}

// 修改密码
const updatePasswordService = async (password: Userx) => {
  return await usePatch(`admin/password`, password)
}

// 修改个人信息
const updateUserInfoService = async (user: Userx) => {
  const data = await usePatch(`admin/userinfo`, user)
  userStore.setUser(data)
  return userStore.UserS
}

export const Admin = {
  CollegesAndAdminsService,
  SearchCollegeService,
  addCollegeService,
  editCollegeService,
  deleteCollegeService,
  addCollegeAdminService,
  editCollegeAdminService,
  deleteCollegeAdminService,
  updatePasswordService,
  updateUserInfoService
}
