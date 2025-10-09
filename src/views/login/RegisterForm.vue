<template>
  <el-form
    :rules="rules"
    :model="form"
    ref="formRef"
    label-width="80px"
    label-position="top"
    class="w-80">
    <!-- 学院/专业 -->
    <el-form-item label="学院/专业" prop="cascaderValue">
      <el-cascader
        v-model="form.cascaderValue"
        :options="options"
        :props="props"
        placeholder="请选择学院和专业"
        @change="handleChange" />
    </el-form-item>

    <!-- 用户名 -->
    <el-form-item label="用户名" prop="account">
      <el-input v-model="form.account" placeholder="请输入用户名" :prefix-icon="User" />
    </el-form-item>

    <!-- 姓名 -->
    <el-form-item label="姓名" prop="name">
      <el-input v-model="form.name" placeholder="请输入姓名" :prefix-icon="EditPen" />
    </el-form-item>

    <!-- 密码 -->
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

    <el-button type="primary" :loading="loading" class="login-button" @click="handleRegister">
      <img src="../../assets/icon/Register.png" alt="注册" class="mr-1.5" />
      注册
    </el-button>

    <el-row class="login-link">
      <el-col :span="24" class="content-center">
        <a href="#" class="link-text" @click.prevent="switchToLogin">已有账号？返回登录</a>
      </el-col>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import { useMessage } from '@/components/message'
import { CollegesAndMajorsService, RegisterService } from '@/services/LoginService'
import { EditPen, Lock, User } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'

const emit = defineEmits<{
  'switch-to-login': []
}>()

const message = useMessage()
const formRef = ref<FormInstance>()
const loading = ref(false)
let collegesAndMajors = null // 所有学院和专业
const options = ref([])

// 获取学院和专业
const getList = async () => {
  try {
    const res = await CollegesAndMajorsService()
    collegesAndMajors = res

    // 拼接级联选择器选项
    options.value = collegesAndMajors.map((college: any) => ({
      id: college.id,
      name: college.name,
      majors: college.majors.map((major: any) => ({
        id: major.id,
        name: major.name,
        categoryId: major.categoryId
      }))
    }))
    console.log('生成的options结构:', options.value)
  } catch (error) {
    console.error('获取数据失败！', error)
  }
}

// 切换到登录表单
const switchToLogin = (): void => {
  emit('switch-to-login')
}

// 级联选择器配置
const props = reactive({
  expandTrigger: 'hover' as const, //  hover 展开子选项
  value: 'id', // 选项的 value 字段
  label: 'name', // 选项的 label 字段
  children: 'majors', // 子选项的字段
  checkStrictly: false // 严格选择（必须选到最后一级，即专业）
})

const handleChange = (value: any[]) => {
  form.value.collegeId = ''
  form.value.majorId = ''

  const [collegeId, majorId] = value || []

  form.value.collegeId = collegeId
  form.value.majorId = majorId

  const college = options.value.find((item: any) => {
    return item.id === collegeId
  }) as any
  console.log('xueyuan:', college)
  let categoryId = ''
  if (college) {
    const major = college.majors.find((majorItem: any) => {
      return majorItem.id === majorId
    })
    if (major) {
      categoryId = major.categoryId
    }
  }
  form.value.categoryId = categoryId
  console.log('数据:', form.value)
}

const form = ref({
  account: '',
  password: '',
  confirmPassword: '',
  name: '',
  cascaderValue: [],
  collegeId: '',
  categoryId: '',
  majorId: ''
})

const handleRegister = async () => {
  const formRule = await formRef.value?.validate()
  if (!formRule) return
  try {
    loading.value = true
    // 提交的注册数据
    const registerData = {
      account: form.value.account,
      password: form.value.password,
      name: form.value.name,
      collegeId: form.value.collegeId,
      categoryId: form.value.categoryId,
      majorId: form.value.majorId
    }
    await RegisterService(registerData)
    console.log('注册提交数据：', registerData)
    message.success('注册成功！')
    emit('switch-to-login')
  } catch (error) {
    message.error('注册失败:' + error)
  } finally {
    loading.value = false
  }
}

// 表单验证规则
const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在2到10个字符', trigger: 'blur' }
  ],
  account: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 10, max: 10, message: '用户名长度为10个字符', trigger: 'blur' }
  ],
  cascaderValue: [{ required: true, message: '请选择学院和专业', trigger: 'change' }],
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

onMounted(() => {
  getList()
})
</script>

<style scoped>
.login-button {
  width: 320px;
  display: block;
  margin: 10px auto;
}

.login-link {
  margin-top: 10px;
  text-align: center;
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

:deep(.el-input),
:deep(.el-cascader) {
  width: 100%;
}

/* 级联选择器下拉框宽度适配 */
:deep(.el-cascader-panel) {
  width: 320px !important;
}
</style>
