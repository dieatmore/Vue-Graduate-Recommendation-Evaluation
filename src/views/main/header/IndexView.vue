<template>
  <!-- Header -->
  <header class="admin-header">
    <el-row class="items-center h-full">
      <el-col :span="4">
        <img src="@/assets/images/SchoolBadge2.png" alt="校徽" class="school-badge ml-6" />
      </el-col>
      <el-col :span="11" :offset="7">
        <div class="admin-info flex items-center justify-self-end">
          <img src="@/assets/icon/头像.png" alt="头像" class="avatar" />
          <span class="admin-name">{{ user?.name }}</span>
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
    <aside class="sidebar" :style="{ width: isCollapse ? '60px' : '200px' }">
      <el-menu
        :default-active="route.path"
        class="el-menu-vertical-demo"
        router
        :unique-opened="true"
        :collapse="isCollapse">
        <el-menu-item v-for="(menu, index) of menusMapR" :key="index" :index="menu[1]">
          {{ menu[0] }}
        </el-menu-item>
      </el-menu>
      <!-- 伸缩按钮 -->
      <div style="float: right; margin-right: 10px">
        <el-button
          v-if="!isCollapse"
          style="float: right; margin-right: 10px"
          @click="isCollapse = true">
          <el-icon>
            <Fold />
          </el-icon>
        </el-button>

        <el-button v-if="isCollapse" style="float: right" @click="isCollapse = !isCollapse">
          <el-icon>
            <Expand />
          </el-icon>
        </el-button>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { LogoutService } from '@/services/LoginService'
import { useUserStore } from '@/stores/UserStore'
import { Expand, Fold } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const isCollapse = ref(false)
const userStore = useUserStore()
const user = userStore.UserS

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
  height: 100%;
}
:deep(.el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-menu-item) {
  justify-content: center;
  font-size: large;
}
:deep(
  .el-menu--vertical:not(.el-menu--collapse):not(.el-menu--popup-container) .el-sub-menu__title
) {
  justify-content: center;
  font-size: large;
}
.sidebar {
  background-color: white;
  border-right: 1px solid var(--border-color);
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.05);
  transition: width 0.3s ease;
  height: 100%;
}
</style>
