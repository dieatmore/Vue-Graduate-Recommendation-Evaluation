<template>
  <el-dialog title="上传文件" v-model="dialogVisible">
    <el-upload
      v-model:file-list="fileList"
      action
      :auto-upload="false"
      :limit="1"
      :disabled="formLoading"
      drag
      :on-exceed="handleExceed"
      :on-error="submitFormError">
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
      <el-button :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { useMessage } from '@/components/message'
import { ref } from 'vue'

const message = useMessage()

const formLoading = ref(false)
const dialogVisible = ref(false)
const fileList = ref([])

const departmentId = ref() // 记录专业ID

// 打开上传diolog
const open = async (id: string) => {
  dialogVisible.value = true
  departmentId.value = id
}
defineExpose({ open }) // 提供open方法

// 上传错误提示
const submitFormError = () => {
  message.error('上传失败，请您重新上传！')
  formLoading.value = false
}

// 文件数超出提示
const handleExceed = () => {
  message.error('最多只能上传一个文件！')
}
</script>
