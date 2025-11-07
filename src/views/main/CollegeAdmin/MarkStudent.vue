<template>
  <div class="w-full main-container bg-[#F9FAFB] py-4 px-8">
    <!-- 功能栏 -->
    <div
      class="h-[10%] mt-4 bg-white p-4 rounded-xl border-gray shadow-sm hover-shadow"
      style="border-width: 1px">
      <el-form :inline="true" class="demo-form-inline mt-2 ml-6">
        <el-form-item label="学生学号">
          <el-input placeholder="请输入学生学号" clearable style="width: 240px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary">
            <Search style="width: 1em; height: 1em; margin-right: 4px" />
            搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">
            <RefreshRight style="width: 1em; height: 1em; margin-right: 4px" />
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 学院列表 -->
    <el-table
      class="w-full mt-8 bg-white border-gray shadow-sm rounded-xl hover-shadow"
      :data="studentListR"
      stripe
      style="width: 100%; border-width: 1px"
      height="690"
      empty-text="暂无学生数据，请添加或刷新">
      <el-table-column prop="account" label="学号">
        <template #default="scope">
          <span class="font-medium">{{ scope.row.account }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="name" label="姓名">
        <template #default="scope">
          <span class="font-medium">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="scorex" label="成绩">
        <template #default="scope">
          <span class="font-medium">{{ scope.row.scorex || '暂无' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="ranking" label="排名">
        <template #default="scope">
          <span class="font-medium">{{ scope.row.ranking || '暂无' }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="confirmed_score" label="已认定成绩">
        <template #default="scope">
          <span class="font-medium">{{ scope.row.confirmed_score }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="confirmed_items" label="已认定项数">
        <template #default="scope">
          <el-tag type="success">{{ scope.row.confirmed_items }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="pending_items" label="待审核项数">
        <template #default="scope">
          <el-tag type="default">{{ scope.row.pending_items }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="modify_items" label="待修改项数">
        <template #default="scope">
          <el-tag type="info">{{ scope.row.modify_items }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="rejected_items" label="已驳回项数">
        <template #default="scope">
          <el-tag type="danger">{{ scope.row.rejected_items }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" plain @click="studentDetailF(scope.row.id)">
            <EditPen style="width: 1em; height: 1em; margin-right: 4px" />
            查看详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup lang="ts">
import router from '@/router'
import { Teacher } from '@/services/TeacherService'
import { EditPen, RefreshRight, Search } from '@element-plus/icons-vue'
import { toRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const catIdR = toRef(() => route.params.categoryId as string)
const majorIdR = toRef(() => route.params.majorId as string)

const { data: studentListR } = Teacher.getStudentsListService(catIdR, majorIdR) // 获取学生统计列表

const studentDetailF = (studentId: string) => {
  router.push(`/students/${studentId}`)
}
</script>

<style scoped>
.main-container {
  min-height: calc(100vh - 64px);
}
::v-deep .el-table .cell {
  text-align: center;
}
.hover-shadow {
  overflow: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
:deep(.el-form-item__label::before) {
  content: none !important;
}
.log-icon {
  font-size: 20px;
  transition: font-size 0.2s;
}
.log-icon:hover {
  font-size: 24px;
}
.text-primary:hover {
  text-decoration: underline #409eff;
  text-underline-offset: 2px;
}
</style>
