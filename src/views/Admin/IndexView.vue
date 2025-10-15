<template>
  <div class="admin-layout">
    <!-- Header -->
    <header class="admin-header">
      <el-row class="items-center h-full">
        <el-col :span="4">
          <img src="@/assets/images/SchoolBadge2.png" alt="校徽" class="school-badge ml-6" />
        </el-col>
        <el-col :span="11" :offset="7">
          <div class="admin-info flex items-center justify-self-end">
            <img src="@/assets/icon/头像.png" alt="头像" class="avatar" />
            <span class="admin-name">超级管理员</span>
          </div>
        </el-col>
        <el-col :span="1" :offset="0">
          <div class="logout-btn flex items-center cursor-pointer" @click="Logout">
            <img src="@/assets/icon/退出.png" alt="退出" class="logout-icon ml-10" />
          </div>
        </el-col>
      </el-row>
    </header>

    <div class="admin-content">
      <!-- 左侧边栏 -->
      <aside class="sidebar">
        <el-menu :default-active="route.path" class="el-menu-vertical-demo" router>
          <el-menu-item index="/college">
            <el-icon><icon-menu /></el-icon>
            <span style="font-weight: bolder">学院管理</span>
          </el-menu-item>
          <el-menu-item index="/admininfo">
            <el-icon><Avatar /></el-icon>
            <span style="font-weight: bolder">个人中心</span>
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
import { LogoutService } from '@/services/LoginService'
import { Avatar, Menu as IconMenu } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 退出登录
const Logout = () => LogoutService()
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
  width: 100%;
  height: 100%;
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
  /* padding: 8px 16px; */
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
  height: 28px;
  width: 28px;
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

.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: var(--bg-color);
}

:deep(.el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item) {
  justify-content: center;
  font-size: large;
}
</style>
