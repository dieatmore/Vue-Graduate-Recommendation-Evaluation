<template>
  <el-form :rules="rules" ref="formRef" label-width="50px" label-position="top" class="w-80">
    <el-form-item label="用户名" prop="username">
      <el-input v-model="form.username" placeholder="请输入用户名" :prefix-icon="User" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        :prefix-icon="Lock"
        show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="form.confirmPassword"
        type="password"
        placeholder="请再次输入密码"
        :prefix-icon="Lock"
        show-password />
    </el-form-item>
    <el-button type="primary" :loading="loading" class="login-button" @click="handleRegister">
      注册
    </el-button>
    <el-row>
      <el-col :span="10" :offset="12" class="content-center">
        <a href="#" class="link-text" @click.prevent="switchToLogin">已有账号？返回登录</a>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { Lock, User } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'

// 使用defineEmits定义事件（带类型）
const emit = defineEmits<{
  'switch-to-login': []
}>()

// 表单状态管理
const formRef = ref<FormInstance>()
const loading = ref(false)

// 使用reactive管理表单数据
const form = reactive({
  username: '',
  password: '',
  confirmPassword: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 5, max: 20, message: '长度在5到20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 20, message: '长度在5到20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== form.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 处理注册逻辑
const handleRegister = async (): Promise<void> => {
  if (!formRef.value) return
  try {
    await formRef.value.validate()
    loading.value = true
    // 模拟注册请求
    // 实际项目中替换为真实的API调用
    console.log('注册信息:', form)
    loading.value = false
  } catch (error) {
    console.error('验证失败:', error)
    loading.value = false
  }
}

// 切换到登录表单
const switchToLogin = (): void => {
  emit('switch-to-login')
}
</script>

<style scoped>
.login-button {
  width: 320px;
  display: block;
  margin: 10px auto;
}

.link-text {
  font-size: 14px;
  color: #409eff;
  transition: color 0.2s ease;
  font-weight: 500;
}

.link-text:hover {
  color: rgba(64, 158, 255, 0.9);
  text-decoration: underline;
}

/* Vue3的深度选择器语法 */
:deep(.el-form-item__label::before) {
  content: none !important;
}

:deep(.el-form-item__label) {
  font-size: 14px;
  color: #606266;
  margin-bottom: 6px;
  font-weight: bold;
}

:deep(.el-input) {
  width: 100%;
}
</style>
