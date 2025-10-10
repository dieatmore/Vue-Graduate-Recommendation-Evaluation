import { useDelete, useGet, usePatch, usePost } from '@/axios'
import type { College, Userx } from '@/types'

// 管理员获取所有学院和学院管理员
export const CollegesAndAdminsService = async () => {
  return await useGet('admin/collegesadmins')
}

// 搜索学院（名称）
export const SearchCollegeService = async (collegeName: string) => {
  return await useGet(`admin/collegesadmins/${collegeName}`)
}

// 添加学院
export const addCollegeService = async (data: College) => {
  return await usePost('admin/colleges', data)
}

// 修改学院
export const editCollegeService = async (id: string, data: College) => {
  return await usePatch(`admin/colleges/${id}`, data)
}

// 删除学院
export const deleteCollegeService = async (id: string) => {
  return await useDelete(`admin/colleges/${id}`)
}

// 添加学院管理员
export const addCollegeAdminService = async (id: string, data: Userx) => {
  return await usePost(`admin/colleges/${id}`, data)
}

// 修改学院管理员
export const editCollegeAdminService = async (id: string, data: Userx) => {
  return await usePatch(`admin/users/${id}`, data)
}

// 删除学院管理员
export const deleteCollegeAdminService = async (id: string) => {
  return await useDelete(`admin/users/${id}`)
}
