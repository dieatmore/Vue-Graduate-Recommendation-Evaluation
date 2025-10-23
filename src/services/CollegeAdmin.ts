import { useDelete, useGet, usePatch, usePost } from '@/axios'
import { useUserStore } from '@/stores/UserStore'
import type { Category, TargetNode, Userx } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { type Ref } from 'vue'
import { querycachename } from './Const'

const userStore = useUserStore()

// 搜索学院（名称）
const getCollegeService = () => {
  return useQuery({
    queryKey: [querycachename.college.collegename],
    queryFn: () => useGet(`collegeadmin/college`)
  })
}

// 修改密码
const updatePasswordService = async (password: Userx) => {
  return await usePatch(`collegeadmin/password`, password)
}

// 修改个人信息
const updateUserInfoService = async (user: Userx) => {
  const data = await usePatch(`collegeadmin/userinfo`, user)
  userStore.setUser(data)
  return userStore.UserS
}

// 获取类别列表
const getCategoryService = () => {
  return useQuery({
    queryKey: [querycachename.college.categories],
    queryFn: () => useGet(`collegeadmin/categorys`)
  })
}

// 新增类别
const addCategoryService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (category: Category) => usePost(`collegeadmin/categorys`, category),
    onSuccess: () => qc.refetchQueries({ queryKey: [querycachename.college.categories] })
  })
}

// 删除类别
const deleteCategoryService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => useDelete(`collegeadmin/categorys/${id}`),
    onSuccess: () => qc.refetchQueries({ queryKey: [querycachename.college.categories] })
  })
}

// 获取所有规则节点
const getAllNodeRulesService = (catId: Ref<string>) => {
  return useQuery({
    queryKey: [querycachename.college.category.noderules, catId],
    queryFn: () => useGet(`collegeadmin/categorys/${catId.value}/targetnodes`)
  })
}

// 新增/修改规则节点
const updateNodeRuleService = (catId: Ref<string>) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (nodeRule: TargetNode) =>
      usePost(`collegeadmin/categorys/${catId.value}/targetnodes`, nodeRule),
    onSuccess: () =>
      qc.refetchQueries({
        queryKey: [querycachename.college.category.noderules, catId]
      })
  })
}

// 删除规则节点
const deleteNodeRuleService = (catId: Ref<string>) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (nodeId: string) =>
      useDelete(`collegeadmin/categorys/${catId.value}/targetnodes/${nodeId}`),
    onSuccess: () =>
      qc.refetchQueries({
        queryKey: [querycachename.college.category.noderules, catId]
      })
  })
}

// 拖拽更新节点
const dragNodeRuleService = (catId: Ref<string>) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ nodeId, parentId }: { nodeId: string; parentId: string }) =>
      usePatch(`collegeadmin/categorys/${catId.value}/targetnodes/${nodeId}`, parentId),
    onSuccess: () =>
      qc.refetchQueries({
        queryKey: [querycachename.college.category.noderules, catId]
      })
  })
}

export const CollegeAdmin = {
  getCollegeService,
  updatePasswordService,
  updateUserInfoService,
  getCategoryService,
  addCategoryService,
  deleteCategoryService,
  getAllNodeRulesService,
  updateNodeRuleService,
  deleteNodeRuleService,
  dragNodeRuleService
}
