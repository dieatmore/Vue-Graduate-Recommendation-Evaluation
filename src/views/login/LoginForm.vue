<template>
  <el-form
    :rules="rules"
    ref="formRef"
    :model="form"
    label-width="50px"
    label-position="top"
    class="w-80">
    <el-form-item label="账号" prop="account">
      <el-input v-model="form.account" placeholder="请输入账号" :prefix-icon="User" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input
        v-model="form.password"
        type="password"
        placeholder="请输入密码"
        :prefix-icon="Lock"
        show-password />
    </el-form-item>
    <el-button type="primary" :loading="loading" class="login-button" @click="handleLogin">
      <img src="../../assets/icon/Login.png" alt="登录" class="mr-1.5" />
      登录
    </el-button>
    <el-row>
      <el-col :span="6" :offset="1" class="content-center">
        <a href="#" class="link-text">忘记密码？</a>
      </el-col>
      <el-col :span="6" :offset="11" class="content-center">
        <a href="#" class="link-text" @click.prevent="switchToRegister">学生注册</a>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { loginService } from '@/services/LoginService'
import type { Userx } from '@/types'
import { Lock, User } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

const emit = defineEmits<{
  'switch-to-register': []
}>()

const formRef = ref<FormInstance>()
const loading = ref(false)

const form = ref<Userx>({
  account: '',
  password: ''
})

// 表单验证规则
const rules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 5, max: 20, message: '长度在5到20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 5, max: 20, message: '长度在5到20个字符', trigger: 'blur' }
  ]
}

// 登录
const handleLogin = async () => {
  const formRule = await formRef.value?.validate()
  if (!formRule) return
  try {
    loading.value = true
    await loginService(form.value)
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

// 切换到注册表单
const switchToRegister = (): void => {
  emit('switch-to-register')
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
