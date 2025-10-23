<template>
  <div class="w-full main-container bg-[#F9FAFB] py-8 px-40">
    <!-- 个人信息 -->
    <div
      class="bg-white p-4 rounded-xl border-gray shadow-sm mt-28 py-20 px-12 hower-shadow"
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
              所属学院
            </div>
          </template>
          <el-tag size="large">{{ college.name || '暂无数据' }}</el-tag>
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
          <el-button type="primary" @click="openDialog1">修改密码</el-button>
          <el-button type="success" class="button-info" @click="openDialog2">
            更新个人信息
          </el-button>
        </div>
      </div>

      <!-- 修改密码dialog -->
      <el-dialog v-model="dialogFormVisible1" title="修改密码" width="400" @close="handleClose">
        <el-form :rules="rules" :model="form" ref="formRef">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              show-password />
          </el-form-item>
          <!-- 确认密码 -->
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="form.confirmPassword"
              type="password"
              placeholder="请再次输入密码"
              :prefix-icon="Lock"
              show-password />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible1 = false">取消</el-button>
            <el-button type="primary" @click="handleConfirm1" :loading="submitting">确认</el-button>
          </span>
        </template>
      </el-dialog>

      <!-- 更新信息dialog -->
      <el-dialog v-model="dialogFormVisible2" title="更新详细信息" width="400" @close="handleClose">
        <el-form :rules="rulesUser" :model="newUser" ref="formUserRef">
          <el-form-item label="账号" prop="account">
            <el-input v-model="newUser.account" autocomplete="off" :rows="4" />
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="newUser.name" autocomplete="off" :rows="4" />
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="newUser.phone" autocomplete="off" :rows="4" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogFormVisible2 = false">取消</el-button>
            <el-button type="primary" @click="handleConfirm2" :loading="submitting">确认</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useMessage } from '@/components/message'
import router from '@/router'
import { CollegeAdmin } from '@/services/CollegeAdmin'
import { useUserStore } from '@/stores/UserStore'
import type { Userx } from '@/types'
import { EditPen, House, Iphone, Lock, User } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

const userStore = useUserStore()
const user = userStore.UserS

const message = useMessage()
const dialogFormVisible1 = ref(false)
const dialogFormVisible2 = ref(false)
const submitting = ref(false)
const formRef = ref<FormInstance>()
const formUserRef = ref<FormInstance>()

const form = ref({
  password: '',
  confirmPassword: ''
})

const newUser = ref({
  name: '',
  account: '',
  phone: ''
})

// 获取学院名称
const { data: college } = CollegeAdmin.getCollegeService()

// 打开弹窗1
const openDialog1 = () => {
  dialogFormVisible1.value = true
  form.value.password = ''
}

// 打开弹窗2
const openDialog2 = () => {
  dialogFormVisible2.value = true
  newUser.value.account = ''
  newUser.value.name = ''
  newUser.value.phone = ''
}

// 修改密码
const handleConfirm1 = async () => {
  await formRef.value?.validate()
  console.log(form.value.password)
  await CollegeAdmin.updatePasswordService(form.value as Userx)
  message.success('密码修改成功，请重新登录！')
  userStore.clear()
  sessionStorage.clear()
  router.replace('/')
}

// 关闭dialog
const handleClose = () => {
  dialogFormVisible1.value = false
  dialogFormVisible2.value = false
  formRef.value?.resetFields()
  formUserRef.value?.resetFields()
}

// 更新信息
const handleConfirm2 = async () => {
  await formUserRef.value?.validate()
  await CollegeAdmin.updateUserInfoService(newUser.value)
  dialogFormVisible2.value = false
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
        if (value !== form.value.password) {
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
.hover-shadow {
  min-height: calc(100vh - 125px);
  overflow: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
