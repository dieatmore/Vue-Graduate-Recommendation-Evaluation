import { useDelete, useGet, usePatch, usePost } from '@/axios'
import { useCategoryStore } from '@/stores/CategoryStore'
import { useNodeRulesStore } from '@/stores/NodeRuleStore'
import { useUserStore } from '@/stores/UserStore'
import type { Category, TargetNode, Userx } from '@/types'

const categoryStore = useCategoryStore()
const userStore = useUserStore()
const noderuleStore = useNodeRulesStore()

// 搜索学院（名称）
const getCollegeService = async () => {
  return await useGet(`collegeadmin/college`)
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
const getCategoryService = async () => {
  if (categoryStore.categorysS.value?.length) return categoryStore.categorysS
  const data = await useGet(`collegeadmin/categorys`)
  categoryStore.categorysS.value = data
  return categoryStore.categorysS
}

// 新增类别
const addCategoryService = async (category: Category) => {
  await usePost(`collegeadmin/categorys`, category)
  const data = await useGet(`collegeadmin/categorys`)
  categoryStore.categorysS.value = data
  return categoryStore.categorysS
}

// 删除类别
const deleteCategoryService = async (id: string) => {
  await useDelete(`collegeadmin/categorys/${id}`)
  const data = await useGet(`collegeadmin/categorys`)
  categoryStore.categorysS.value = data
  return categoryStore.categorysS
}

// 获取所有规则节点
const getAllNodeRulesService = async (catId: string) => {
  if (noderuleStore.nodeRulesS.value?.[catId]?.length) {
    return noderuleStore.nodeRulesS.value[catId]
  }
  const data = await useGet(`collegeadmin/categorys/${catId}/targetnodes`)
  noderuleStore.setNodeRules(catId, data)
  return noderuleStore.nodeRulesS.value[catId]
}

// 新增/修改规则节点
const updateNodeRuleService = async (catId: string, nodeRule: TargetNode) => {
  await usePost(`collegeadmin/categorys/${catId}/targetnodes`, nodeRule)
  const data = await useGet(`collegeadmin/categorys/${catId}/targetnodes`)
  noderuleStore.setNodeRules(catId, data)
  return noderuleStore.nodeRulesS.value[catId]
}

// 删除规则节点
const deleteNodeRuleService = async (catId: string, nodeId: string) => {
  await useDelete(`collegeadmin/categorys/${catId}/targetnodes/${nodeId}`)
  const data = await useGet(`collegeadmin/categorys/${catId}/targetnodes`)
  noderuleStore.setNodeRules(catId, data)
  return noderuleStore.nodeRulesS.value[catId]
}

// 拖拽更新节点
const dragNodeRuleService = async (catId: string, nodeId: string, parentId: string) => {
  await usePatch(`collegeadmin/categorys/${catId}/targetnodes/${nodeId}`, parentId)
  const data = await useGet(`collegeadmin/categorys/${catId}/targetnodes`)
  noderuleStore.setNodeRules(catId, data)
  return noderuleStore.nodeRulesS.value[catId]
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
