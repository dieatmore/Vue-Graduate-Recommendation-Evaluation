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
    <aside class="sidebar" :style="{ width: isCollapse ? '60px' : '200px' }">
      <el-menu
        :default-active="route.path"
        class="el-menu-vertical-demo"
        router
        :unique-opened="true"
        :collapse="isCollapse">
        <template v-for="(menu, index) in menuItemsR" :key="index">
          <!-- 无子菜单的菜单项 -->
          <el-menu-item v-if="!menu.children" :index="menu.path">
            <component :is="menu.icon" class="w-6 mr-1" />
            <span :style="menu.style">{{ menu.name }}</span>
          </el-menu-item>

          <!-- 有一级子菜单 -->
          <el-sub-menu v-else-if="menu.children && !menu.children[0]?.children" :index="menu.path">
            <template #title>
              <component :is="menu.icon" class="w-6 mr-1" />
              <span :style="menu.style">{{ menu.name }}</span>
            </template>

            <el-menu-item v-for="(child, i) in menu.children" :key="i" :index="child.path">
              {{ child.name }}
            </el-menu-item>
          </el-sub-menu>

          <!-- 有二级子菜单 -->
          <el-sub-menu v-else-if="menu.children && menu.children[0]?.children" :index="menu.path">
            <template #title>
              <component :is="menu.icon" class="w-6 mr-1" />
              <span :style="menu.style">{{ menu.name }}</span>
            </template>

            <el-sub-menu v-for="(child, i) in menu.children" :key="i" :index="child.path">
              <template #title>
                {{ child.name }}
              </template>

              <el-menu-item
                v-for="(grandChild, j) in child.children"
                :key="j"
                :index="grandChild.path">
                {{ grandChild.name }}
              </el-menu-item>
            </el-sub-menu>
          </el-sub-menu>
        </template>

        <!-- 折叠/展开按钮 -->
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
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>
<script setup lang="ts">
import { CollegeAdmin } from '@/services/CollegeAdmin'
import { LogoutService } from '@/services/LoginService'
import { useUserStore } from '@/stores/UserStore'
import { Role, type Category, type MenuItem } from '@/types'
import {
  Avatar,
  Expand,
  Fold,
  Menu as IconMenu,
  Key,
  List,
  Management
} from '@element-plus/icons-vue'
import { computed, ref, toRef } from 'vue'
import { useRoute } from 'vue-router'

const isCollapse = ref(false)
const userStore = useUserStore()
const user = userStore.UserS

const route = useRoute()
const role = toRef(() => user.value?.role)

// CollegeAdmin
const {
  data: categoryListR,
  suspense: suspenseMajor,
  isEnabled: isCategory
} = CollegeAdmin.getCategoryService(role) // 专业管理
if (isCategory.value) await suspenseMajor()

const {
  data: catMajorsR,
  suspense: suspenseMark,
  isEnabled: isCatMajors
} = CollegeAdmin.getCatMajorsService(role) // 学生审批
if (isCatMajors.value) await suspenseMark()

// computed获取菜单数据
const menuItemsR = computed<MenuItem[]>(() => {
  const items: MenuItem[] = []

  if (user.value?.role == Role.ADMIN) {
    console.log('yes')
    items.push({
      name: '学院管理',
      path: '/college',
      icon: IconMenu,
      style: { 'font-weight': 'bolder' }
    })
    items.push({
      name: '个人中心',
      path: '/admininfo',
      icon: Avatar,
      style: { 'font-weight': 'bolder' }
    })
  }

  if (user.value?.role == Role.COLLAGE_ADMIN) {
    items.push({
      name: '类别管理',
      path: '/category',
      icon: IconMenu,
      style: { 'font-weight': 'bolder' }
    })
    items.push({
      name: '专业管理',
      path: '/major',
      icon: Management,
      style: { 'font-weight': 'bolder' },
      children: categoryListR.value.map((category: Category) => ({
        name: category.name,
        path: `/categorys/${category.id}/managemajors`
      }))
    })
    items.push({
      name: '学生审批',
      path: '/mark',
      icon: List,
      style: { 'font-weight': 'bolder' },
      children: catMajorsR.value.map((catMajors: any) => ({
        name: catMajors.categoryName,
        path: `/categorys/${catMajors.id}/markmajors`,
        children: catMajors.majors.map((major: any) => ({
          name: major.name,
          path: `/categorys/${catMajors.id}/markmajors/${major.id}/markstudents`
        }))
      }))
    })
    items.push({
      name: '推免规则管理',
      path: '/noderule',
      icon: List,
      style: { 'font-weight': 'bolder' },
      children: categoryListR.value.map((category: Category) => ({
        name: category.name,
        path: `/categorys/${category.id}/noderules`
      }))
    })
    items.push({
      name: '重置密码',
      path: '/resetpassword',
      icon: Key,
      style: { 'font-weight': 'bolder' }
    })
    items.push({
      name: '个人中心',
      path: '/userinfo',
      icon: Avatar,
      style: { 'font-weight': 'bolder' }
    })
  }
  return items
})
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
