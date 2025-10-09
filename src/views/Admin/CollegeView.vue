<template>
  <div class="college-container">
    <!-- 功能栏 -->
    <div class="toolbar">
      <el-form :inline="true" class="search-form">
        <el-form-item label="专业名称" label-width="80px">
          <el-input placeholder="请输入专业名称" clearable class="search-input" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-search">
            <Search style="margin-right: 4px" />
            搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-reset">
            <RefreshRight style="margin-right: 4px" />
            重置
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" class="btn-add">
            <Plus style="margin-right: 4px" />
            新增专业
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 新增专业dialog -->
      <!-- <el-dialog title="新增专业" width="400px" center>
        <el-form>
          <el-form-item label="专业名称" label-width="80px">
            <el-input autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button>取消</el-button>
            <el-button type="primary">确认</el-button>
          </span>
        </template>
      </el-dialog> -->
    </div>

    <!-- 专业列表 -->
    <div class="table-container">
      <el-table
        v-loading="loading"
        class="data-table"
        stripe
        height="calc(100vh - 240px)"
        empty-text="暂无专业数据，请添加或刷新"
        :header-cell-style="headerCellStyle"
        :row-class-name="tableRowClassName">
        <el-table-column prop="id" label="专业ID" width="200" />
        <el-table-column prop="name" label="专业名称" min-width="200" />
        <el-table-column prop="updateTime" label="创建时间" width="220" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" plain size="small" class="btn-import mr-2">
              <Download style="margin-right: 4px" />
              导入教师
            </el-button>
            <el-button type="danger" size="small" class="btn-delete">
              <DeleteFilled style="margin-right: 4px" />
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <TeacherFile ref="formRef" />
</template>

<script setup lang="ts">
import { DeleteFilled, Download, Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import { ref } from 'vue'

const loading = ref(false)
const formRef = ref()

// 表格样式配置
const headerCellStyle = () => {
  return {
    backgroundColor: '#f8fafc',
    fontWeight: 500,
    color: '#334155',
    fontSize: '14px'
  }
}

const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}
</script>

<style scoped>
:root {
  --primary-color: #165dff;
  --success-color: #00b42a;
  --danger-color: #f53f3f;
  --bg-color: #f8fafc;
  --text-color: #334155;
  --border-color: #e2e8f0;
  --hover-bg: #eff6ff;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.college-container {
  padding: 20px;
  background-color: var(--bg-color);
  min-height: 100%;
}

.toolbar {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.toolbar:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-form {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.search-input {
  width: 300px;
  border-radius: 8px !important;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(22, 93, 255, 0.1);
}

.btn-search,
.btn-reset,
.btn-add {
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.btn-search:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(22, 93, 255, 0.3);
}

.btn-reset:hover {
  background-color: var(--hover-bg);
  color: var(--primary-color);
}

.btn-add {
  background-color: var(--success-color);
  border-color: var(--success-color);
}

.btn-add:hover {
  background-color: #00a329;
  border-color: #00a329;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 180, 42, 0.3);
}

.table-container {
  background-color: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow);
  transition: all 0.3s ease;
}

.table-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.data-table {
  border-radius: 8px;
  overflow: hidden;
}

.data-table::v-deep .el-table__inner-wrapper {
  border-radius: 8px;
  overflow: hidden;
}

.data-table::v-deep .el-table__header {
  border-bottom: 2px solid var(--border-color);
}

.data-table::v-deep .el-table__body {
  font-size: 14px;
}

.data-table::v-deep .el-table__body tr {
  transition: all 0.3s ease;
}

.data-table::v-deep .el-table__body tr:hover {
  background-color: var(--hover-bg);
  transform: scale(1.002);
}

.data-table::v-deep .el-table__body-wrapper {
  border-radius: 0 0 8px 8px;
}

.data-table::v-deep .el-table .cell {
  text-align: center;
  padding: 12px 8px;
}

.even-row {
  background-color: #fefefe;
}

.odd-row {
  background-color: #fafafa;
}

.btn-import,
.btn-delete {
  border-radius: 6px;
  padding: 4px 12px;
  transition: all 0.3s ease;
  font-size: 12px;
}

.btn-import:hover {
  background-color: var(--hover-bg);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.btn-delete {
  background-color: #fff1f0;
  border-color: #ffccc7;
}

.btn-delete:hover {
  background-color: #ffccc7;
  border-color: var(--danger-color);
  box-shadow: 0 2px 4px rgba(245, 63, 63, 0.2);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .search-input {
    width: 250px;
  }
}

@media (max-width: 768px) {
  .college-container {
    padding: 10px;
  }

  .search-input {
    width: 100%;
  }

  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar {
    padding: 15px;
  }

  .table-container {
    padding: 15px;
  }
}
</style>
