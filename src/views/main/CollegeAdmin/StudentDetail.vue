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
            {{ studentInfoR?.status == 1 ? '重置信息状态' : '认定学生信息' }}
          </el-button>
        </template>
      </el-popconfirm>
      <el-descriptions class="w-full" :column="3" border size="large" title="学生基本信息">
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">姓名</div>
          </template>
          {{ studentInfoR?.name }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">账号</div>
          </template>
          {{ studentInfoR?.account }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">手机号</div>
          </template>
          {{ studentInfoR?.phone || '暂无信息' }}
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">加权成绩</div>
          </template>
          <el-text tag="mark">{{ studentInfoR?.scorex || '暂无信息' }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">排名</div>
          </template>
          <el-text tag="mark">{{ studentInfoR?.ranking || '暂无信息' }}</el-text>
        </el-descriptions-item>
        <el-descriptions-item>
          <template #label>
            <div class="cell-item">成绩状态</div>
          </template>
          <el-tag type="success" v-if="studentInfoR?.status == 1">已认定</el-tag>
          <el-tag type="default" v-else>未认定</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </div>

    <!-- 评定指标参考数据 -->
    <div
      class="h-[20%] mt-4 bg-white p-4 rounded-xl justify-evenly border-gray shadow-sm hover-shadow"
      style="border-width: 1px">
      <div class="flex">
        <span class="el-descriptions__title">评定参考指标</span>
        <el-button type="primary" class="ml-8" @click="showAll">加载全部</el-button>
      </div>
      <div class="mt-4 ml-4">
        <div>
          <div>
            <template v-for="node in nodeRulesR" :key="node.id">
              <el-button
                type="info"
                plain
                class="m-2"
                :class="{
                  'node-selected': selectedNodeIds.includes(node.id),
                  'level-0': true
                }"
                @click="handleNodeClick(node, 0)">
                {{ node.name }}
              </el-button>
            </template>
          </div>
          <div v-for="node in nodeRulesR" :key="node.id">
            <div v-if="selectedNodeIds.includes(node.id)">
              <el-tooltip class="box-item" effect="dark" content="上限分数" placement="top-start">
                <el-tag type="primary" class="mx-2">{{ node.maxMark }}</el-tag>
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" content="限项" placement="top-start">
                <el-tag type="warning" class="mx-2">
                  {{ node.maxNumber ? `${node.maxNumber}` : '无限制' }}
                </el-tag>
              </el-tooltip>
              <p class="mt-2 text-gray-400" style="font-size: small; word-wrap: break-word">
                {{ node.comment ? node.comment : '暂无规则说明' }}
              </p>
            </div>
          </div>
        </div>

        <div
          v-for="(levelItem, levelIndex) in expandedNodeLevels"
          :key="`level-${levelIndex}`"
          :style="{
            marginTop: '12px',
            marginLeft: `${8 + levelIndex * 12}px`,
            paddingLeft: '8px',
            borderLeft: '2px solid #e5e7eb'
          }">
          <div>
            <div class="flex">
              <template v-for="childNode in levelItem.nodes" :key="childNode.id">
                <el-button
                  type="info"
                  plain
                  class="m-2"
                  :class="{
                    'node-selected': selectedNodeIds.includes(childNode.id),
                    [`level-${levelIndex + 1}`]: true
                  }"
                  @click="handleNodeClick(childNode, levelIndex + 1)">
                  {{ childNode.name }}
                </el-button>
              </template>
            </div>
            <div v-for="childNode in levelItem.nodes" :key="childNode.id">
              <div v-if="selectedNodeIds.includes(childNode.id)">
                <el-tooltip class="box-item" effect="dark" content="上限分数" placement="top-start">
                  <el-tag type="primary" class="mx-2">{{ childNode.maxMark }}</el-tag>
                </el-tooltip>
                <el-tooltip class="box-item" effect="dark" content="限项" placement="top-start">
                  <el-tag type="warning" class="mx-2">
                    {{ childNode.maxNumber ? `${childNode.maxNumber}` : '无限制' }}
                  </el-tag>
                </el-tooltip>
                <p class="mt-2 text-gray-400" style="font-size: small; word-wrap: break-word">
                  {{ childNode.comment ? childNode.comment : '暂无规则说明' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 提交列表 -->
    <el-table
      class="w-full mt-8 bg-white border-gray shadow-sm rounded-xl hover-shadow"
      :data="submitListR"
      stripe
      style="width: 100%; border-width: 1px"
      empty-text="暂无学生数据"
      :max-height="Infinity">
      <el-table-column prop="name" label="指标名称" width="220">
        <template #default="scope">
          <el-text class="font-medium" truncated>
            {{ scope.row.name }}
          </el-text>
        </template>
      </el-table-column>

      <el-table-column prop="submitName" label="提交名称" width="180">
        <template #default="scope">
          <el-text class="font-medium" truncated>{{ scope.row.submitName }}</el-text>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="状态" width="120">
        <template #default="scope">
          <el-tag
            v-if="scope.row.status === status.SUBMIT"
            type="default"
            disable-transitions="true">
            已提交
          </el-tag>
          <el-tag
            v-else-if="scope.row.status === status.REJECT"
            type="danger"
            disable-transitions="true">
            被驳回
          </el-tag>
          <el-tag
            v-else-if="scope.row.status === status.CONFIRM"
            type="success"
            disable-transitions="true">
            已认定
          </el-tag>
          <el-tag
            v-else-if="scope.row.status === status.REVIEW"
            type="info"
            disable-transitions="true">
            待修改
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="mark" label="得分" width="100">
        <template #default="scope">
          <span class="font-medium">{{ scope.row.mark }}</span>
        </template>
      </el-table-column>

      <el-table-column label="佐证文件">
        <template #default="scope">
          <div v-if="scope.row.files.length === 0" class="text-gray-400 text-sm">暂无佐证</div>

          <div v-else class="admin-list">
            <span v-for="(file, index) in scope.row.files" :key="file.id" class="admin-item">
              <div class="flex items-center">
                <span class="file_name w-200" @click="openFileF(file.id)">{{ file.fileName }}</span>
              </div>
              <span v-if="index < scope.row.files.length - 1" class="separator mx-1"><br /></span>
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="record" label="日志" width="80">
        <template #default="scope">
          <el-icon class="log-icon" @click="openLogDialog(scope.row.record)" cursor="pointer">
            <View />
          </el-icon>
        </template>
      </el-table-column>

      <el-table-column prop="comment" label="说明" width="80">
        <template #default="scope">
          <el-icon class="log-icon" @click="openCommentDialog(scope.row.comment)" cursor="pointer">
            <ChatDotRound />
          </el-icon>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button type="primary" plain @click="openMarkDialogF(scope.row)">
            <EditPen style="width: 1em; height: 1em; margin-right: 4px" />
            审批
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
import { CollegeAdmin } from '@/services/CollegeAdmin'
import { Teacher } from '@/services/TeacherService'
import { status, type LogRecord } from '@/types'
import { ChatDotRound, EditPen, InfoFilled, View } from '@element-plus/icons-vue'
import { ElMessageBox, type FormInstance } from 'element-plus'
import { ref, toRef, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const studentIdR = toRef(() => route.params.studentId as string)

const { data: studentDetailR } = Teacher.getStudentDetailService(studentIdR)
const originalSubmitListR = ref<any[]>([])
const submitListR = ref<any[]>([])
watch(
  () => studentDetailR.value,
  newVal => {
    if (newVal && Array.isArray(newVal)) {
      originalSubmitListR.value = [...newVal] // 深拷贝备份原始数据
      submitListR.value = [...newVal] // 初始化为全部数据
    } else {
      originalSubmitListR.value = []
      submitListR.value = []
    }
  },
  { immediate: true } // 立即执行一次
)

const showAll = () => {
  submitListR.value = [...originalSubmitListR.value]
  selectedNodeIds.value = []
  expandedNodeLevels.value = []
}

const { data: studentInfoR, suspense: suspenseInfo } = Teacher.getStudentInfoService(studentIdR)
await suspenseInfo()
const majorIdR = toRef(() => studentInfoR.value?.majorId)
const markSubmitNodeMutation = Teacher.markSubmitNodeService(studentIdR, majorIdR)

const message = useMessage()

const catIdR = toRef(() => route.params.catId as string)
const { data: nodeRulesR, refetch: refetchNode } = CollegeAdmin.getAllNodeRulesService(catIdR)
refetchNode()

const selectedNodeIds = ref<any>([])
const expandedNodeLevels = ref<any>([])
const findParentNodeIds = (targetNode: any, allNodes: any) => {
  const parentIds = []
  // 先把当前节点加入
  parentIds.push(targetNode.id)

  // 递归找父节点
  const findParent = (node: any, nodes: any) => {
    for (const n of nodes) {
      if (n.id === node.parentId) {
        parentIds.unshift(n.id) // 父节点插入到数组头部（保证顺序：根→子）
        if (n.parentId) {
          // 还有父节点继续找
          findParent(
            n,
            allNodes.flatMap((item: any) => [item, ...(item.children || [])])
          )
        }
        break
      }
      if (n.children && n.children.length) {
        findParent(node, n.children)
      }
    }
  }

  if (targetNode.parentId) {
    const flatNodes = allNodes.flatMap((item: any) => [item, ...(item.children || [])])
    findParent(targetNode, flatNodes)
  }
  return parentIds
}

// 递归查找指定 ID 的节点（从树形数组中）
const findNodeById = (nodeList: any[], targetId: string): any => {
  for (const node of nodeList) {
    if (node.id === targetId) {
      return node
    }
    // 递归查找子节点
    if (node.children && node.children.length > 0) {
      const found = findNodeById(node.children, targetId)
      if (found) return found
    }
  }
  return null // 未找到返回null
}

// 递归提取指定节点下的所有叶子节点 ID
const getAllLeafNodeIds = (node: any, leafIds: string[] = []): string[] => {
  // 叶子节点判断：无children 或 children为空
  if (!node.children || node.children.length === 0) {
    leafIds.push(node.id)
    return leafIds
  }
  // 非叶子节点，递归遍历子节点
  for (const child of node.children) {
    getAllLeafNodeIds(child, leafIds)
  }
  return leafIds
}

const fillSubmits = (node: any, level: any) => {
  if (level == 0) {
    submitListR.value = originalSubmitListR.value.filter(
      (submit: any) => submit.rootNodeId == node.id
    )
  } else {
    const targetNode = findNodeById(nodeRulesR.value, node.id)

    // 提取该节点下所有叶子节点ID
    const leafNodeIds = getAllLeafNodeIds(targetNode)

    // 过滤submitListR，保留targetNodeId匹配叶子节点ID的项
    submitListR.value = originalSubmitListR.value.filter((submit: any) => {
      return leafNodeIds.includes(submit.targetNodeId)
    })
  }
}

const handleNodeClick = (currentNode: any, currentLevel: any) => {
  fillSubmits(currentNode, currentLevel)

  // 查找当前节点的所有父节点ID（构建层级链路）
  const allRootNodes = nodeRulesR.value // 根节点源
  const parentIds = findParentNodeIds(currentNode, allRootNodes)

  // 更新选中节点ID（保证链路完整）
  selectedNodeIds.value = parentIds

  // 判断当前节点是否有子节点
  if (!currentNode.children || currentNode.children.length === 0) {
    expandedNodeLevels.value = expandedNodeLevels.value.slice(0, currentLevel)
    return
  }

  // 处理层级逻辑：移除当前层级之后的所有展开层级（避免多级混乱）
  expandedNodeLevels.value = expandedNodeLevels.value.slice(0, currentLevel)

  // 追加当前节点的子节点到下一级
  expandedNodeLevels.value.push({
    parentId: currentNode.id,
    nodes: currentNode.children
  })
}

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

// 打开说明
const openCommentDialog = (comment: string) => {
  const formattedComment = comment.replace(/\n/g, '<br/>')
  ElMessageBox.alert(formattedComment, '提交说明', {
    confirmButtonText: 'OK',
    dangerouslyUseHTMLString: true
  })
}

// 关闭日志
const handleCloseDialog = () => {
  dialogVisible.value = false
}

// 打开文件
const openFileF = (fileId: string) => {
  const url = `/api/open/openfile/${fileId}`
  // 新窗口打开（浏览器自动解析文件流）
  window.open(url, '_blank')
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
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
:deep(.el-form-item__label::before) {
  content: none !important;
}
.node-selected {
  background-color: #909399 !important;
  color: white !important;
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
:deep(.el-scrollbar__thumb) {
  background-color: none !important;
  opacity: none !important;
}
:deep(.el-scrollbar__bar.is-vertical > div) {
  width: 0px;
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
.log-icon {
  font-size: 20px;
  transition: font-size 0.2s;
}
.log-icon:hover {
  font-size: 24px;
}
.file_name {
  cursor: pointer;
}
.file_name:hover {
  text-decoration: underline;
}
::v-deep .el-table {
  width: 100%;
}
</style>
