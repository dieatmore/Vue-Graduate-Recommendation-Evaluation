import '@/output.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import { useMessage } from './components/message'
import router from './router'
import queryClient from './vuequery'

const message = useMessage()

const app = createApp(App)

app.use(router)
app.use(VueQueryPlugin, { queryClient })
app.use(ElementPlus)
app.mount('#app')

app.config.errorHandler = (err: any) => {
  // 判断是否为 Element Plus 表单验证错误
  const isFormValidationError = (error: any): boolean => {
    // 表单错误是对象，非数组、非 null
    if (typeof error !== 'object' || error === null || Array.isArray(error)) {
      return false
    }
    // 表单错误的每个字段值是包含 message 的数组
    const fieldErrors = Object.values(error)
    return fieldErrors.every(errors => {
      return Array.isArray(errors) && errors.length > 0 && typeof errors[0].message === 'string'
    })
  }

  // 处理表单验证错误
  if (isFormValidationError(err)) {
    return
  }
  message.error(err)
}
