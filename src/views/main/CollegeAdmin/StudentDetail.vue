<template>
  <div class="w-full main-container bg-[#F9FAFB] py-4 px-8">
    <!-- 功能栏 -->
    <div
      class="h-[20%] mt-4 bg-white p-4 rounded-xl justify-evenly border-gray shadow-sm hover-shadow"
      style="border-width: 1px">
      <el-popconfirm
        :title="studentInfoR?.status == 0 ? '确定认定该成绩吗？' : '确定重置成绩状态吗？'"
        confirm-button-text="确认"
        cancel-button-text="取消">
        <template #reference>
          <el-button
            :type="studentInfoR?.status == 0 ? 'primary' : 'default'"
            size="mini"
            class="status-btn float-right mr-4">
            {{ studentInfoR?.status == 1 ? '重置状态' : '认定成绩' }}
          </el-button>
        </template>
      </el-popconfirm>
      <el-descriptions class="w-full" :column="3" border size="large" title="学生基本信息">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <EditPen />
              </el-icon>
              姓名
            </div>
          </template>
          {{ studentInfoR?.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <User />
              </el-icon>
              账号
            </div>
          </template>
          {{ studentInfoR?.account }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Iphone />
              </el-icon>
              手机号
            </div>
          </template>
          {{ studentInfoR?.phone || '暂无信息' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Iphone />
              </el-icon>
              成绩
            </div>
          </template>
          {{ studentInfoR?.scorex || '暂无信息' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Iphone />
              </el-icon>
              排名
            </div>
          </template>
          {{ studentInfoR?.ranking || '暂无信息' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">
              <el-icon>
                <Iphone />
              </el-icon>
              成绩状态
            </div>
          </template>
          <el-tag type="success" v-if="studentInfoR?.status == 1">已认定</el-tag>
          <el-tag type="default" v-else>未认定</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 提交列表 -->
    <el-table
      class="w-full mt-8 bg-white border-gray shadow-sm rounded-xl hover-shadow"
      :data="studentDetailR"
      stripe
      style="width: 100%; border-width: 1px"
      height="603"
      empty-text="暂无学生数据，请添加或刷新">
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
          <span class="font-medium">{{ scope.row.mark }}</span>
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
          <el-button type="primary" plain @click="openMarkDialogF(scope.row)">
            <EditPen style="width: 1em; height: 1em; margin-right: 4px" />
            审批指标
          </el-button>
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
      <div class="table-scroll-container">
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
      </div>
    </el-dialog>

    <!-- 审批dialog -->
    <el-dialog v-model="dialogFormVisibleR" @close="handleCloseF" title="审批指标" width="400">
      <el-form :model="addFormR" ref="formIns" label-width="100px" :rules="rules">
        <el-form-item label="分数" prop="mark">
          <div class="input-with-tooltip">
            <el-input-number
              v-model="addFormR.mark"
              :min="0"
              :max="markThis.maxMark"
              :step="0.1"
              :precision="1" />
            <el-tooltip
              :content="`提示信息：分数范围为0到${markThis.maxMark}分`"
              placement="right"
              effect="dark">
              <InfoFilled style="width: 1.5em; height: 1.5em; margin-left: 4px" />
            </el-tooltip>
          </div>
        </el-form-item>
        <el-form-item label="审批说明" prop="comment">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            autocomplete="off"
            v-model="addFormR.comment" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="handleConfirmF('P5eR')">需修改</el-button>
          <el-button type="danger" @click="handleConfirmF('b7Yz')">驳回指标</el-button>
          <el-button type="primary" @click="handleConfirmF('59G7')">认定指标</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { useMessage } from '@/components/message'
import { Teacher } from '@/services/TeacherService'
import { status, type LogRecord } from '@/types'
import { EditPen, Files, InfoFilled, View } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ref, toRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const studentIdR = toRef(() => route.params.studentId as string)
const { data: studentDetailR } = Teacher.getStudentDetailService(studentIdR)
const { data: studentInfoR, suspense: suspenseInfo } = Teacher.getStudentInfoService(studentIdR)
await suspenseInfo()
const majorIdR = toRef(() => studentInfoR.value?.majorId)
const markSubmitNodeMutation = Teacher.markSubmitNodeService(studentIdR, majorIdR)

const message = useMessage()
const dialogFormVisibleR = ref(false)
const dialogVisible = ref(false)
const currentRecords = ref<LogRecord[]>([])

const markThis = ref()

const formIns = ref<FormInstance>()
const addFormR = ref({
  id: '',
  mark: 0,
  comment: '',
  status: ''
})

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

// 修改/驳回/认定 按钮
const handleConfirmF = async (status: string) => {
  await formIns.value?.validate()
  addFormR.value.status = status
  await markSubmitNodeMutation.mutateAsync({
    submitId: addFormR.value.id,
    submitData: addFormR.value
  })
  dialogFormVisibleR.value = false
  message.success('审批成功！')
}

// 打开审批dialog
const openMarkDialogF = (targetSubmit: any) => {
  addFormR.value.id = targetSubmit.id
  markThis.value = targetSubmit
  dialogFormVisibleR.value = true
  console.log(markThis)
}

// 关闭审批dialog
const handleCloseF = () => {
  formIns.value?.resetFields()
  dialogFormVisibleR.value = false
  addFormR.value.mark = 0
}
// 格式化时间
const formatTime = (timeStr: any) => {
  // 将 "2025-10-06 15:11:19.000000" 转为 "2025-10-06 15:11:19"
  if (!timeStr) return ''
  return timeStr.split('.')[0]
}

const rules = ref({
  mark: [{ required: true, message: '请输入分数', trigger: ['blur', 'change'] }],
  comment: [
    { required: true, max: 200, message: '规则说明最多200个字符', trigger: ['blur', 'change'] }
  ]
})
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
:deep(.el-descriptions__title) {
  color: var(--el-text-color-primary);
  font-weight: bold;
  font-size: 18px !important;
  margin-left: 8px;
}
.input-with-tooltip {
  display: flex;
  align-items: center;
}
.table-scroll-container {
  height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  margin: -16px;
  padding: 16px;
}
.table-scroll-container::-webkit-scrollbar {
  width: 6px;
}
.table-scroll-container::-webkit-scrollbar-thumb {
  background-color: #e0e0e0;
  border-radius: 3px;
}
.table-scroll-container::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

::v-deep .el-table {
  width: 100%;
}
</style>
