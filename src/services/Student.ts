import { useGet, usePost } from '@/axios'
import { Role } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'
import { querycachename } from './Const'

// 搜索学院（名称）
const getRootNodeService = (role: Ref) => {
  return useQuery({
    queryKey: [querycachename.college.category.noderules],
    queryFn: () => useGet(`student/nodes`),
    enabled: computed(() => role.value == Role.STUDENT)
  })
}

// 根节点下学生的所有提交记录
const getSubmitNodesService = (rootId: Ref) => {
  return useQuery({
    queryKey: [querycachename.college.submitnodes, rootId],
    queryFn: () => useGet(`student/nodes/${rootId.value}/submits`)
  })
}

// 根据父节点查找所有子节点
const getChildrenService = (rootId: Ref) => {
  return useQuery({
    queryKey: [querycachename.college.childrennodes, rootId],
    queryFn: () => useGet(`student/childrenNodes/${rootId.value}`)
  })
}

// 新增提交指标
const addSubmitNodeService = (rootId: Ref) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (nodeId: string) =>
      usePost(`student/nodes/${rootId.value}/submits/${nodeId}`, nodeId),
    onSuccess: () => qc.refetchQueries({ queryKey: [querycachename.college.submitnodes, rootId] })
  })
}

export const Student = {
  getRootNodeService,
  getSubmitNodesService,
  getChildrenService,
  addSubmitNodeService
}
