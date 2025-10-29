<template>
  <div>
    <div class="flex items-center ml-6 mt-3">
      <HelpFilled class="w-16 h-16" />
      <span class="text-3xl ml-4">智慧公寓</span>
    </div>
  </div>
  <div class="container-img">
    <img
      src="../../assets/images/View.jpg"
      alt="校园风景"
      class="w-full h-full object-cover img-color" />
  </div>
  <div class="right-section">
    <el-card class="box-card">
      <div>
        <p class="card-text">账号密码登录</p>
      </div>

      <component :is="toggle ? LoginForm : RegisterForm" @switch="toggle = !toggle" />
    </el-card>
  </div>
</template>
<script setup lang="ts">
import { HelpFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
import LoginForm from './LoginForm1.vue'
import RegisterForm from './RegisterForm1.vue'

const toggle = ref(true)
</script>
<style scoped>
.container-img {
  position: fixed;
  top: 10%;
  left: 0;
  width: 100%;
  height: 90%;
  z-index: -1;
  overflow: hidden;
}
.header-img {
  width: 100px;
  height: 100px;
}
.right-section {
  position: fixed;
  right: 18%;
  top: 55%;
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
