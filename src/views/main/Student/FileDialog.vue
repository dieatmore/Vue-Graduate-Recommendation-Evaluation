<template>
  <el-dialog title="上传文件" v-model="dialogVisible" @close="handleCloseF">
    <el-upload
      v-model:file-list="fileList"
      action
      :auto-upload="false"
      :limit="1"
      :disabled="formLoading"
      drag
      :on-exceed="handleExceed"
      :on-error="submitFormError"
      :before-upload="handleBeforeUpload">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip" style="color: red">
          提示：1.支持所有格式文件上传！ 2.仅支持上传一个文件 3.建议文件大小不超过100MB
        </div>
      </template>
    </el-upload>

    <template #footer>
      <el-button :disabled="formLoading" @click="handleUpload">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { useMessage } from '@/components/message'
import { Student } from '@/services/Student'
import type { UploadFile } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits<{
  refresh: []
}>()

const message = useMessage()

const formLoading = ref(false)
const dialogVisible = ref(false)
const fileList = ref<UploadFile[]>([])
const targetSubmitId = ref() // 记录专业ID

// 打开上传diolog
const open = async (id: string) => {
  dialogVisible.value = true
  targetSubmitId.value = id
}
defineExpose({ open }) // 提供open方法

// 关闭dialog
const handleCloseF = () => {
  dialogVisible.value = false
  fileList.value = []
  formLoading.value = false
}

// 上传前校验文件大小（100MB）
const handleBeforeUpload = (file: File) => {
  const maxSize = 100 * 1024 * 1024 // 100MB
  if (file.size > maxSize) {
    message.error(`文件大小不能超过100MB，当前：${(file.size / 1024 / 1024).toFixed(2)}MB`)
    return false
  }
  return true
}

// 上传错误提示
const submitFormError = () => {
  message.error('上传失败，请您重新上传！')
  formLoading.value = false
}

// 文件数超出提示
const handleExceed = () => {
  message.error('最多只能上传一个文件！')
}

// 提交上传（传递文件+target_submit_id）
const handleUpload = async () => {
  if (!targetSubmitId.value) {
    message.error('提交节点ID异常，请刷新重试！')
    return
  }
  if (fileList.value.length === 0) {
    message.warning('请先选择文件！')
    return
  }
  if (!fileList.value[0]) {
    return
  }
  const file = fileList.value[0].raw as File
  const formData = new FormData()
  formData.append('file', file) // 上传文件
  formLoading.value = true

  await Student.UploadFileService(formData, targetSubmitId.value)
  message.success('文件上传成功！')
  emit('refresh')
  handleCloseF()
}
</script>
