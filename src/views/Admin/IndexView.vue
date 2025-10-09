<template>
  <div class="admin-layout">
    <!-- Header -->
    <header class="admin-header">
      <el-row class="items-center h-full">
        <el-col :span="4">
          <img src="@/assets/images/SchoolBadge.png" alt="校徽" class="school-badge" />
        </el-col>
        <el-col :span="10" :offset="4">
          <div class="admin-info flex items-center justify-center">
            <img src="@/assets/icon/头像.png" alt="头像" class="avatar" />
            <span class="admin-name">管理员</span>
          </div>
        </el-col>
        <el-col :span="4" :offset="2">
          <div class="logout-btn flex items-center justify-center cursor-pointer" @click="Logout">
            <span>退出登录</span>
            <img src="@/assets/icon/退出.png" alt="退出" class="logout-icon ml-2" />
          </div>
        </el-col>
      </el-row>
    </header>

    <div class="admin-content">
      <!-- 左侧边栏 -->
      <aside class="sidebar">
        <el-menu
          default-active="/college"
          class="menu"
          router
          background-color="#f8fafc"
          text-color="#334155"
          active-text-color="#165dff">
          <el-menu-item index="/college" class="menu-item">
            <el-icon><icon-menu /></el-icon>
            <span>学院管理</span>
          </el-menu-item>
          <el-menu-item index="/college" class="menu-item">
            <el-icon><icon-menu /></el-icon>
            <span>专业管理</span>
          </el-menu-item>
        </el-menu>
      </aside>

      <!-- 右侧详情 -->
      <main class="main-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { Menu as IconMenu } from '@element-plus/icons-vue'

// 退出登录
const Logout = () => {
  sessionStorage.clear()
  router.replace('/')
}
</script>

<style scoped>
:root {
  --primary-color: #165dff;
  --bg-color: #f8fafc;
  --text-color: #334155;
  --border-color: #e2e8f0;
  --hover-bg: #eff6ff;
}

.admin-layout {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
}

.admin-header {
  height: 60px;
  background-color: white;
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.school-badge {
  height: 44px;
  transition: transform 0.2s ease;
}

.school-badge:hover {
  transform: scale(1.05);
}

.admin-info {
  padding: 8px 0;
}

.avatar {
  height: 24px;
  width: 24px;
  border-radius: 50%;
  border: 2px solid var(--border-color);
}

.admin-name {
  margin-left: 8px;
  font-size: 16px;
  font-weight: 500;
  color: var(--text-color);
}

.logout-btn {
  padding: 8px 16px;
  border-radius: 8px;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: var(--hover-bg);
  color: var(--primary-color);
  transform: translateY(-1px);
}

.logout-icon {
  height: 18px;
  width: 18px;
}

.admin-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background-color: white;
  border-right: 1px solid var(--border-color);
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.05);
}

.menu {
  border-right: none !important;
  min-height: 100%;
}

.menu-item {
  padding: 16px 20px !important;
  margin: 4px 8px !important;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: var(--hover-bg) !important;
}

.menu-item.is-active {
  background-color: var(--hover-bg) !important;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: var(--bg-color);
}
</style>
