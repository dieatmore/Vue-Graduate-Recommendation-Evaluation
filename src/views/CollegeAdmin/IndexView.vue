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
          <el-menu-item index="/category">
            <el-icon><icon-menu /></el-icon>
            <span style="font-weight: bolder">类别管理</span>
          </el-menu-item>

          <!-- 专业管理 -->
          <el-sub-menu index="/major">
            <template #title>
              <el-icon><Management /></el-icon>
              <span style="font-weight: bolder">专业管理</span>
            </template>

            <!-- 类别子菜单 - 动态生成 -->
            <el-menu-item
              v-for="category in categoryList"
              :key="category.id"
              :index="`/categorys/${category.id}/majors`">
              {{ category.name }}
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/teachermanage">
            <el-icon><Opportunity /></el-icon>
            <span style="font-weight: bolder">导师管理</span>
          </el-menu-item>

          <!-- 推免规则管理 -->
          <el-sub-menu index="/noderule">
            <template #title>
              <el-icon><List /></el-icon>
              <span style="font-weight: bolder">推免规则管理</span>
            </template>

            <!-- 类别子菜单 - 动态生成 -->
            <el-menu-item
              v-for="category in categoryList"
              :key="category.id"
              :index="`/categorys/${category.id}/noderules`">
              {{ category.name }}
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/resetpassword">
            <el-icon><Key /></el-icon>
            <span style="font-weight: bolder">重置密码</span>
          </el-menu-item>

          <el-menu-item index="/userinfo">
            <el-icon><Avatar /></el-icon>
            <span style="font-weight: bolder">个人中心</span>
          </el-menu-item>
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
import { CollegeAdmin } from '@/services/CollegeAdmin'
import { LogoutService } from '@/services/LoginService'
import { useUserStore } from '@/stores/UserStore'
import {
  Avatar,
  Expand,
  Fold,
  Menu as IconMenu,
  Key,
  List,
  Management,
  Opportunity
} from '@element-plus/icons-vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const isCollapse = ref(false)
const userStore = useUserStore()
const categoryList = await CollegeAdmin.getCategoryService()
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

.main-content {
  flex: 1;
  overflow-y: auto;
  background-color: var(--bg-color);
  transition: width 0.3s ease;
}
</style>
