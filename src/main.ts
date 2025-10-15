import '@/output.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import App from './App.vue'
import { useMessage } from './components/message'
import router from './router'

const message = useMessage()

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.mount('#app')

app.config.errorHandler = (err: any) => {
  message.error(err)
}
