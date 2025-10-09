<template>
  <div class="container-img">
    <img
      src="../../assets/images/View.jpg"
      alt="校园风景"
      class="w-full h-full object-cover img-color" />
  </div>
  <div>
    <img src="../../assets/images/SchoolBadge.png" alt="校徽" class="mt-4 ml-4 w-64 badge" />
  </div>
  <div class="right-section">
    <el-card class="box-card">
      <div>
        <p class="card-text">推免管理系统</p>
      </div>

      <LoginForm v-if="currentForm === 'login'" @switch-to-register="switchToRegister" />
      <RegisterForm v-if="currentForm === 'register'" @switch-to-login="switchToLogin" />
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'

const currentForm = ref('login')

// 切换到注册表单
const switchToRegister = () => {
  currentForm.value = 'register'
}

// 切换到登录表单
const switchToLogin = () => {
  currentForm.value = 'login'
}
</script>
<style scoped>
.container-img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}
.right-section {
  position: fixed;
  right: 12%;
  top: 50%;
  transform: translateY(-50%);
}
.box-card {
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}
.card-text {
  font-weight: bolder;
  font-size: 1.5rem;
  font-family: 'Microsoft YaHei', sans-serif;
  margin-bottom: 25px;
  color: #333;
  text-align: center;
}
.el-card.is-always-shadow {
  border-radius: 14px;
}
</style>
