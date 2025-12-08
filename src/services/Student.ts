import axios, { useDelete, useGet, usePost } from '@/axios'
import { createProgressNotification } from '@/components/progress'
import { Role, type Progress, type ResultVO } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, ref, type Ref } from 'vue'
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

// 删除提交指标
const deleteSubmitNodeService = (rootId: Ref) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (submitId: string) =>
      useDelete(`student/nodes/${rootId.value}/submits/${submitId}`),
    onSuccess: () => qc.refetchQueries({ queryKey: [querycachename.college.submitnodes, rootId] })
  })
}

// 上传文件
const UploadFileService = async (formData: FormData, targetSubmitId: string) => {
  const uploadFile = formData.get('uploadFile')
  const fileName = uploadFile instanceof File ? uploadFile.name : ''
  const progressR = ref<{ progress: Progress }>({
    progress: { percentage: 0, title: fileName, rate: 0, total: 0, loaded: 0 }
  })
  const progNotif = createProgressNotification(progressR.value)

  const response = await axios.post<ResultVO>(
    `student/submit-file/upload/${targetSubmitId}`, // 上传接口地址
    formData,
    {
      onUploadProgress(ProgressEvent) {
        if (!ProgressEvent) return
        progressR.value.progress.percentage = ProgressEvent.progress ?? 0
        progressR.value.progress.rate = ProgressEvent.rate ?? 0
        progressR.value.progress.loaded = ProgressEvent.loaded ?? 0
        progressR.value.progress.total = ProgressEvent.total ?? 0
      }
    }
  )
  progNotif.close()
  return response.data
}

// 删除文件
const deleteFileService = (rootId: Ref) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (fileId: string) => useDelete(`student/submit-file/${fileId}`),
    onSuccess: () => qc.refetchQueries({ queryKey: [querycachename.college.submitnodes, rootId] })
  })
}

export const Student = {
  getRootNodeService,
  getSubmitNodesService,
  getChildrenService,
  addSubmitNodeService,
  deleteSubmitNodeService,
  UploadFileService,
  deleteFileService
}
