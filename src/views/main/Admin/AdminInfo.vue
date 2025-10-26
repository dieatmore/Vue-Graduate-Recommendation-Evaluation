<template>
  <div class="w-full main-container bg-[#F9FAFB] py-8 px-40">
    <!-- 个人信息 -->
    <div
      class="bg-white p-4 rounded-xl border-gray shadow-sm mt-28 py-20 px-12"
      style="border-width: 1px">
      <el-descriptions class="" title="个人信息" :column="2" border size="large">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <EditPen />
              </el-icon>
              姓名
            </div>
          </template>
          {{ user?.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <User />
              </el-icon>
              账号
            </div>
          </template>
          {{ user?.account }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <House />
              </el-icon>
              角色
            </div>
          </template>
          <el-tag size="large">超级管理员</el-tag>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Iphone />
              </el-icon>
              手机号
            </div>
          </template>
          {{ user?.phone || '暂无信息' }}
        </el-descriptions-item>
      </el-descriptions>

      <!-- 操作 -->
      <div class="relative px-4 pt-24">
        <div class="absolute right-8">
          <el-button type="primary" @click="openDialogF1">修改密码</el-button>
          <el-button type="success" class="button-info" @click="openDialogF2">
            更新个人信息
          </el-button>
        </div>
      </div>

      <!-- 修改密码dialog -->
      <el-dialog v-model="dialogFormVisibleR1" title="修改密码" width="400" @close="handleCloseF">
        <el-form :rules="rules" :model="formR" ref="formIns">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="formR.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password />
          </el-form-item>
          <!-- 确认密码 -->
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="formR.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              :prefix-icon="Lock"
              show-password />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisibleR1 = false">取消</el-button>
            <el-button type="primary" @click="handleConfirmF1">确认</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 更新信息dialog -->
      <el-dialog
        v-model="dialogFormVisibleR2"
        title="更新详细信息"
        width="400"
        @close="handleCloseF">
        <el-form :rules="rulesUser" :model="newUserR" ref="formUserIns">
          <el-form-item label="账号" prop="account">
            <el-input v-model="newUserR.account" autocomplete="off" :rows="4" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="newUserR.name" autocomplete="off" :rows="4" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="newUserR.phone" autocomplete="off" :rows="4" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisibleR2 = false">取消</el-button>
            <el-button type="primary" @click="handleConfirmF2">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useMessage } from '@/components/message'
import router from '@/router'
import { Admin } from '@/services/Admin'
import { useUserStore } from '@/stores/UserStore'
import type { Userx } from '@/types'
import { EditPen, House, Iphone, Lock, User } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

const userStore = useUserStore()
const user = userStore.UserS

const message = useMessage()
const dialogFormVisibleR1 = ref(false)
const dialogFormVisibleR2 = ref(false)
const formIns = ref<FormInstance>()
const formUserIns = ref<FormInstance>()

const formR = ref({
  password: '',
  confirmPassword: ''
})

const newUserR = ref({
  name: '',
  account: '',
  phone: ''
})

// 打开弹窗1
const openDialogF1 = () => {
  dialogFormVisibleR1.value = true
  formR.value.password = ''
}

// 打开弹窗2
const openDialogF2 = () => {
  dialogFormVisibleR2.value = true
  newUserR.value.account = ''
  newUserR.value.name = ''
  newUserR.value.phone = ''
}

// 修改密码
const handleConfirmF1 = async () => {
  await formIns.value?.validate()
  await Admin.updatePasswordService(formR.value as Userx)
  message.success('密码修改成功，请重新登录！')
  userStore.clear()
  sessionStorage.clear()
  router.replace('/')
}

// 关闭dialog
const handleCloseF = () => {
  dialogFormVisibleR1.value = false
  dialogFormVisibleR2.value = false
  formIns.value?.resetFields()
  formUserIns.value?.resetFields()
}

// 更新信息
const handleConfirmF2 = async () => {
  await formUserIns.value?.validate()
  await Admin.updateUserInfoService(newUserR.value)
  dialogFormVisibleR2.value = false
  message.success('更新成功!')
}

// 表单验证规则
const rules = ref({
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 20, message: '密码长度在5到20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== formR.value.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
})

const rulesUser = ref({
  // 账号验证
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在2到10个字符', trigger: 'blur' }
  ],
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 10, max: 10, message: '账号长度为10个字符', trigger: 'blur' }
  ],
  // 手机号验证
  phone: [
    { required: true, message: '请输入手机号', trigger: ['blur', 'change'] },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号格式（11位数字，以1开头）',
      trigger: 'blur'
    }
  ]
})
</script>

<style scoped>
.main-container {
  min-height: calc(100vh - 64px);
}
.button-info {
  margin-left: 24px;
}
:deep(.el-descriptions__title) {
  font-size: 24px !important;
  margin-left: 15px;
}
:deep(.el-form-item__label::before) {
  content: none !important;
}
</style>
