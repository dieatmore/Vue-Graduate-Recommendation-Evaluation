<template>
  <div class="w-full main-container bg-[#F9FAFB] py-4 px-8">
    <!-- 功能栏 -->
    <div
      class="h-[10%] mt-4 bg-white p-4 rounded-xl border-gray shadow-sm hover-shadow"
      style="border-width: 1px">
      <el-button type="success" class="ml-4" @click="dialogNodeVisible = true">
        <Plus style="width: 1em; height: 1em; margin-right: 4px" />
        新增提交指标
      </el-button>
    </div>

    <!-- 新增指标dialog -->
    <el-dialog v-model="dialogNodeVisible" title="新增指标" width="600px">
      <el-tree
        class="w-full"
        :data="childrenNodesR"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :indent="16">
        <template #default="{ data }">
          <div class="tree-node-container flex items-center justify-between w-full">
            <div class="node-name font-medium text-gray-800">
              {{ data.name }}
            </div>

            <div class="node-actions grid grid-cols-2 gap-3 w-[150px]">
              <div class="rule-btn-container">
                <el-button
                  v-if="data.comment"
                  type="text"
                  size="mini"
                  class="text-primary"
                  @click="openCommentF(data.comment)">
                  查看规则
                </el-button>
              </div>

              <div class="add-btn-container">
                <el-button
                  v-if="isLeafNode(data)"
                  type="text"
                  size="mini"
                  class="text-primary"
                  @click="addSubmit(data.id)">
                  添加指标
                </el-button>
              </div>
            </div>
          </div>
        </template>
      </el-tree>
    </el-dialog>

    <!-- 学院列表 -->
    <el-table
      class="w-full mt-8 bg-white border-gray shadow-sm rounded-xl hover-shadow"
      :data="submitNodesR"
      stripe
      style="width: 100%; border-width: 1px"
      height="690"
      empty-text="暂无提交数据，请添加或刷新">
      <el-table-column prop="name" label="指标名称">
        <template #default="scope">
          <span class="font-medium">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.status === status.SUBMIT" type="default">已提交</el-tag>
          <el-tag v-else-if="scope.row.status === status.REJECT" type="danger">被驳回</el-tag>
          <el-tag v-else-if="scope.row.status === status.CONFIRM" type="success">已认定</el-tag>
          <el-tag v-else-if="scope.row.status === status.REVIEW" type="info">待修改</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="mark" label="得分">
        <template #default="scope">
          <span class="font-medium">{{ scope.row.mark || '暂无' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="佐证文件">
        <template #default="scope">
          <div v-if="scope.row.files.length === 0" class="text-gray-400 text-sm">暂无佐证</div>

          <div v-else class="admin-list">
            <span v-for="(file, index) in scope.row.files" :key="file.id" class="admin-item">
              <el-tooltip class="box-item" effect="dark" content="点击查看文件" placement="top">
                <el-button type="info" :icon="Files" size="small">
                  {{ file.name }}
                </el-button>
              </el-tooltip>
              <span v-if="index < scope.row.files.length - 1" class="separator mx-1">&</span>
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="record" label="日志">
        <template #default="scope">
          <el-icon class="log-icon" @click="openLogDialog(scope.row.record)" cursor="pointer">
            <View />
          </el-icon>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" plain>
            <EditPen style="width: 1em; height: 1em; margin-right: 4px" />
            上传佐证
          </el-button>
          <el-popconfirm
            title="确定删除该类别吗?"
            confirm-button-text="确认"
            cancel-button-text="取消">
            <template #reference>
              <el-button type="danger" plain>
                <DeleteFilled style="width: 1em; height: 1em; margin-right: 4px" />
                删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 日志dialog -->
    <el-dialog
      v-model="dialogVisible"
      title="日志记录"
      width="800px"
      class="py-16"
      :before-close="handleCloseDialog">
      <el-table
        :data="currentRecords"
        border
        stripe
        :header-cell-style="{ 'background-color': '#f5f7fa' }"
        :row-style="{ height: '60px' }">
        <el-table-column prop="time" label="操作时间" width="200">
          <template #default="scope">
            {{ formatTime(scope.row.time) }}
          </template>
        </el-table-column>
        <el-table-column prop="username" label="操作人" width="120" />
        <el-table-column prop="comment" label="操作内容" flex="1" />
        <el-table-column prop="mark" label="分数" width="100">
          <template #default="scope">
            <span class="text-primary">{{ scope.row.mark }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="currentRecords.length === 0" class="no-log">无日志记录</div>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { useMessage } from '@/components/message'
import { Student } from '@/services/Student'
import { status, type LogRecord } from '@/types'
import { DeleteFilled, EditPen, Files, Plus, View } from '@element-plus/icons-vue'
import { ElMessageBox } from 'element-plus'
import { ref, toRef } from 'vue'
import { useRoute } from 'vue-router'

const message = useMessage()
const dialogVisible = ref(false)
const dialogNodeVisible = ref(false)
const currentRecords = ref<LogRecord[]>([])
const route = useRoute()
const rootId = toRef(() => route.params.nodeId)

const { data: submitNodesR } = Student.getSubmitNodesService(rootId)
const { data: childrenNodesR } = Student.getChildrenService(rootId)

const isLeafNode = (data: any) => {
  return !data.children || data.children.length === 0
}

const addSubmitMutation = Student.addSubmitNodeService(rootId)

const addSubmit = async (nodeId: string) => {
  await addSubmitMutation.mutateAsync(nodeId)
  dialogNodeVisible.value = false
  message.success('添加成功！')
}

// 查看规则说明
const openCommentF = (comment: string) => {
  ElMessageBox.alert(`${comment}`, '规则说明', {
    confirmButtonText: 'OK'
  })
}

// 打开日志
const openLogDialog = (recordStr: string) => {
  currentRecords.value = []
  currentRecords.value = JSON.parse(recordStr)
  dialogVisible.value = true
}

// 关闭日志
const handleCloseDialog = () => {
  dialogVisible.value = false
}

// 格式化时间
const formatTime = (timeStr: any) => {
  // 将 "2025-10-06 15:11:19.000000" 转为 "2025-10-06 15:11:19"
  if (!timeStr) return ''
  return timeStr.split('.')[0]
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
