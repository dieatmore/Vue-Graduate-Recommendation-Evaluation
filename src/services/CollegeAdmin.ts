import { useDelete, useGet, usePatch, usePost } from '@/axios'
import { useUserStore } from '@/stores/UserStore'
import type { Category, Major, TargetNode, Userx } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
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

// 获取类别专业对应关系列表
const getCatMajorsService = () => {
  return useQuery({
    queryKey: [querycachename.college.categorysmajors],
    queryFn: () => useGet('collegeadmin/categorys/catmajors')
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

// 修改类别
const updateCategoryService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ categoryId, cat }: { categoryId: string; cat: Category }) =>
      usePatch(`collegeadmin/categorys/${categoryId}`, cat),
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
const getAllNodeRulesService = (catIdR: Ref<string>) => {
  return useQuery({
    queryKey: [querycachename.college.category.noderules, catIdR],
    queryFn: () => useGet(`collegeadmin/categorys/${catIdR.value}/targetnodes`)
  })
}

// 新增/修改规则节点
const updateNodeRuleService = (catIdR: Ref<string>) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (nodeRule: TargetNode) =>
      usePost(`collegeadmin/categorys/${catIdR.value}/targetnodes`, nodeRule),
    onSuccess: () =>
      qc.refetchQueries({
        queryKey: [querycachename.college.category.noderules, catIdR]
      })
  })
}

// 删除规则节点
const deleteNodeRuleService = (catIdR: Ref<string>) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (nodeId: string) =>
      useDelete(`collegeadmin/categorys/${catIdR.value}/targetnodes/${nodeId}`),
    onSuccess: () =>
      qc.refetchQueries({
        queryKey: [querycachename.college.category.noderules, catIdR]
      })
  })
}

// 拖拽更新节点
const dragNodeRuleService = (catIdR: Ref<string>) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ nodeId, parentId }: { nodeId: string; parentId: string }) =>
      usePatch(`collegeadmin/categorys/${catIdR.value}/targetnodes/${nodeId}`, parentId),
    onSuccess: () =>
      qc.refetchQueries({
        queryKey: [querycachename.college.category.noderules, catIdR]
      })
  })
}

// 根据类别id获取专业列表
const getMajorsByCatIdService = (catIdR: Ref<string>) => {
  return useQuery({
    queryKey: [querycachename.college.majorsbycatid, catIdR],
    queryFn: () => useGet(`collegeadmin/categorys/${catIdR.value}/majors`),
    enabled: computed(() => !!catIdR.value)
  })
}

// 添加专业
const addMajorService = (catIdR: Ref<string>) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (major: Major) => usePost(`collegeadmin/categorys/${catIdR.value}/majors`, major),
    onSuccess: () =>
      qc.refetchQueries({
        queryKey: [querycachename.college.majorsbycatid, catIdR]
      })
  })
}

// 修改专业
const updateMajorService = (catIdR: Ref<string>) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ majorId, major }: { majorId: string; major: Major }) =>
      usePatch(`collegeadmin/categorys/${catIdR.value}/majors/${majorId}`, major),
    onSuccess: () =>
      qc.refetchQueries({
        queryKey: [querycachename.college.majorsbycatid, catIdR]
      })
  })
}

// 删除专业
const deleteMajorService = (catIdR: Ref<string>) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (majorId: string) =>
      useDelete(`collegeadmin/categorys/${catIdR.value}/majors/${majorId}`),
    onSuccess: () =>
      qc.refetchQueries({
        queryKey: [querycachename.college.majorsbycatid, catIdR]
      })
  })
}

// 获取导师及其管理的类别
const getTeachersCatsService = () => {
  return useQuery({
    queryKey: [querycachename.college.teacherscats],
    queryFn: () => useGet(`collegeadmin/teachers`)
  })
}

// 新增导师
const addTeacherService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (user: Userx) => usePost(`collegeadmin/teachers`, user),
    onSuccess: () =>
      qc.refetchQueries({
        queryKey: [querycachename.college.teacherscats]
      })
  })
}

// 修改导师
const updateTeacherService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ teacherId, user }: { teacherId: string; user: Userx }) =>
      usePatch(`collegeadmin/teachers/${teacherId}/info`, user),
    onSuccess: () =>
      qc.refetchQueries({
        queryKey: [querycachename.college.teacherscats]
      })
  })
}

// 删除导师
const deleteTeacherService = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (teacherId: string) => useDelete(`collegeadmin/teachers/${teacherId}`),
    onSuccess: () =>
      qc.refetchQueries({
        queryKey: [querycachename.college.teacherscats]
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
  dragNodeRuleService,
  getMajorsByCatIdService,
  getCatMajorsService,
  updateCategoryService,
  addMajorService,
  updateMajorService,
  deleteMajorService,
  getTeachersCatsService,
  addTeacherService,
  updateTeacherService,
  deleteTeacherService
}
