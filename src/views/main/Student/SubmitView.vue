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

    <el-dialog v-model="dialogNodeVisible" title="新增指标" style="width: auto; max-width: 65vw">
      <div class="mt-4 ml-4 w-full">
        <div>
          <div>
            <template v-for="node in childrenNodesR" :key="node.id">
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
          <div v-for="node in childrenNodesR" :key="node.id">
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
            marginTop: '12px'
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
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogNodeVisible = false">取消</el-button>
          <el-button type="primary" @click="addSubmit(selectedNodeIds[selectedNodeIds.length - 1])">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加指标dialog -->
    <el-dialog v-model="dialogFormVisibleR" @close="handleCloseF" title="审批指标" width="400">
      <el-form :model="addFormR" ref="formIns" label-width="100px">
        <el-form-item label="指标名称" prop="submitName">
          <el-input autocomplete="off" v-model="addFormR.submitName" />
        </el-form-item>
        <el-form-item label="提交说明" prop="comment">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            autocomplete="off"
            v-model="addFormR.comment" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="info" @click="dialogFormVisibleR = false">返回</el-button>
          <el-button type="primary" @click="addConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 学院列表 -->
    <el-table
      class="w-full mt-8 bg-white border-gray shadow-sm rounded-xl hover-shadow"
      :data="submitNodesR"
      stripe
      style="width: 100%; border-width: 1px"
      height="720"
      empty-text="暂无提交数据，请添加或刷新">
      <el-table-column prop="name" label="指标名称">
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
          <span class="font-medium">{{ scope.row.mark || '暂无' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="佐证文件">
        <template #default="scope">
          <div v-if="scope.row.files.length === 0" class="text-gray-400 text-sm">暂无佐证</div>
          <div v-else class="admin-list">
            <span v-for="(file, index) in scope.row.files" :key="file.id" class="admin-item">
              <div class="flex items-center justify-between w-full">
                <el-text class="file_name w-[300px]" @click="openFileF(file.id)">
                  {{ file.fileName }}
                </el-text>
                <el-popconfirm
                  title="确定删除该文件吗?"
                  confirm-button-text="确认"
                  cancel-button-text="取消"
                  @confirm="deleteFileF(file.id)">
                  <template #reference>
                    <CircleClose
                      v-if="scope.row.status == status.SUBMIT || scope.row.status == status.REVIEW"
                      style="width: 1em; height: 1em; margin-left: 4px"
                      class="circle-close-icon" />
                  </template>
                </el-popconfirm>
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

      <el-table-column fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button type="primary" plain @click="openFormF(scope.row)">
            <EditPen style="width: 1em; height: 1em; margin-right: 4px" />
            佐证
          </el-button>
          <el-popconfirm
            title="确定删除该类别吗?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDeleteF(scope.row.id)">
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
    </el-dialog>
    <FileDialog ref="formRef" width="500px" height="300px" @refresh="refreshListF" />
  </div>
</template>
<script setup lang="ts">
import { useMessage } from '@/components/message'
import { Student } from '@/services/Student'
import { status, type LogRecord, type TargetSubmit } from '@/types'
import {
  ChatDotRound,
  CircleClose,
  DeleteFilled,
  EditPen,
  Plus,
  View
} from '@element-plus/icons-vue'
import { ElMessageBox, type FormInstance } from 'element-plus'
import { ref, toRef } from 'vue'
import { useRoute } from 'vue-router'
import FileDialog from './FileDialog.vue'

const message = useMessage()
const dialogVisible = ref(false)
const dialogNodeVisible = ref(false)
const dialogFormVisibleR = ref(false)
const currentRecords = ref<LogRecord[]>([])
const formIns = ref<FormInstance>()
const route = useRoute()
const rootId = toRef(() => route.params.nodeId)

const { data: submitNodesR, refetch: refetchList } = Student.getSubmitNodesService(rootId)
const { data: childrenNodesR } = Student.getChildrenService(rootId)

const handleNodeClick = (currentNode: any, currentLevel: any) => {
  // 查找当前节点的所有父节点ID（构建层级链路）
  const allRootNodes = childrenNodesR.value // 根节点源
  const parentIds = findParentNodeIds(currentNode, allRootNodes)

  // 更新选中节点ID（保证链路完整）
  selectedNodeIds.value = parentIds

  // 判断当前节点是否有子节点
  if (!currentNode.children || currentNode.children.length === 0) {
    expandedNodeLevels.value = expandedNodeLevels.value.slice(0, currentLevel)
  }

  // 处理层级逻辑：移除当前层级之后的所有展开层级（避免多级混乱）
  expandedNodeLevels.value = expandedNodeLevels.value.slice(0, currentLevel)

  // 追加当前节点的子节点到下一级
  expandedNodeLevels.value.push({
    parentId: currentNode.id,
    nodes: currentNode.children
  })
}

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

const addFormR = ref<TargetSubmit>({
  targetNodeId: '',
  submitName: '',
  comment: ''
})

const addSubmitMutation = Student.addSubmitNodeService(rootId)
const deleteSubmitMutation = Student.deleteSubmitNodeService(rootId)
const deleteFileMutation = Student.deleteFileService(rootId)

const addSubmit = (nodeId: string) => {
  dialogNodeVisible.value = false
  addFormR.value.targetNodeId = nodeId
  dialogFormVisibleR.value = true
}

const addConfirm = async () => {
  await addSubmitMutation.mutateAsync(addFormR.value)
  dialogFormVisibleR.value = false
  message.success('添加成功！')
}

const formRef = ref()
// 打开上传佐证dialog
const openFormF = (submitNode: any) => {
  if (submitNode.status == status.CONFIRM || submitNode.status === status.REJECT) {
    message.warning('已认定或者被驳回指标不可提交佐证材料！')
    return
  }
  formRef.value.open(submitNode.id)
}

// 关闭添加指标dialog
const handleCloseF = () => {
  formIns.value?.resetFields()
  dialogFormVisibleR.value = false
  addFormR.value.targetNodeId = ''
}

// 打开文件
const openFileF = (fileId: string) => {
  const url = `/api/open/openfile/${fileId}`
  // 新窗口打开（浏览器自动解析文件流）
  window.open(url, '_blank')
}

// 删除文件
const deleteFileF = async (fileId: string) => {
  await deleteFileMutation.mutateAsync(fileId)
  message.success('删除文件成功！')
}

// 上传文件更新列表
const refreshListF = () => {
  refetchList()
}

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

// 删除submit状态的提交节点
const handleDeleteF = async (submitId: string) => {
  await deleteSubmitMutation.mutateAsync(submitId)
  message.success('删除成功！')
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
.file_name {
  cursor: pointer;
}
.file_name:hover {
  text-decoration: underline;
}
.hover-shadow {
  overflow: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.node-selected {
  background-color: #909399 !important;
  color: white !important;
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
.circle-close-icon:focus {
  outline: none;
  box-shadow: none;
}

/* 悬浮样式：颜色变深 + 轻微缩放 */
.circle-close-icon:hover {
  color: #f56c6c; /* 红色系，与删除操作呼应 */
  transform: scale(1.1); /* 轻微放大 */
  transition: all 0.2s ease; /* 过渡动画，更流畅 */
  cursor: pointer; /* 鼠标变成手型，提示可点击 */
}

/* 可选：点击时的按压效果 */
.circle-close-icon:active {
  transform: scale(0.95);
}
</style>
