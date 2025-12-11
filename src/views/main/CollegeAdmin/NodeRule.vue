<template>
  <div class="w-full main-container bg-[#F9FAFB] py-4 px-8">
    <div
      class="h-full mt-4 bg-white p-4 rounded-xl flex border-gray shadow-sm"
      style="border-width: 1px">
      <el-button type="success" class="flex ml-4" @click="openDialogF({ status: 'add', id: '1' })">
        <Plus style="width: 1em; height: 1em; margin-right: 4px" />
        新增一级指标节点
      </el-button>
    </div>

    <!-- 节点dialog -->
    <el-dialog
      v-model="dialogFormVisibleR"
      @close="handleCloseF"
      :title="dialogStatusR == 'add' ? '添加类别' : '修改类别'"
      width="400">
      <el-form :model="addFormR" ref="formIns" :rules="rules" label-width="100px">
        <el-form-item label="指标名称" prop="name">
          <el-input autocomplete="off" v-model="addFormR.name" />
        </el-form-item>
        <el-form-item label="上限分数" prop="maxMark">
          <el-input-number
            v-model="addFormR.maxMark"
            :min="0.1"
            :max="50"
            :step="0.1"
            :precision="1" />
        </el-form-item>
        <el-form-item label="最大项数" prop="maxNumber">
          <el-input-number v-model="addFormR.maxNumber" :min="0" :max="10" placeholder="(选填)" />
        </el-form-item>
        <el-form-item label="规则说明" prop="comment">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            autocomplete="off"
            placeholder="(选填)"
            v-model="addFormR.comment" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisibleR = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmF">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <div
      class="h-full mt-4 bg-white p-4 rounded-xl flex justify-evenly border-gray shadow-sm hover-shadow"
      style="border-width: 1px">
      <el-tree
        class="w-full"
        :data="nodeRulesR"
        node-key="id"
        draggable
        @node-drag-end="handleDragEndF"
        :allow-drop="allowDropF"
        default-expand-all
        :expand-on-click-node="false">
        <template #default="{ data }">
          <span class="custom-tree-node">
            <div>
              <span>{{ data.name }}</span>
              <el-tooltip class="box-item" effect="dark" content="上限分数" placement="top-start">
                <el-tag type="primary" style="margin-left: 16px">{{ data.maxMark }}</el-tag>
              </el-tooltip>
              <el-tooltip class="box-item" effect="dark" content="最大项数" placement="top-start">
                <el-tag type="warning" style="margin-left: 16px">
                  {{ data.maxNumber || '无' }}
                </el-tag>
              </el-tooltip>
            </div>

            <div class="float-right">
              <el-button
                v-if="data.comment != null"
                type="primary"
                size="small"
                style="margin-left: 16px"
                @click="openCommentF(data.comment)">
                查看规则说明
              </el-button>
              <el-button
                type="text"
                size="small"
                style="margin-left: 8px"
                @click="openDialogF({ status: 'add', id: data.id })">
                添加
              </el-button>
              <el-button
                type="text"
                size="small"
                style="margin-left: 8px"
                @click="openDialogF({ status: 'edit', data: data })">
                修改
              </el-button>
              <el-popconfirm
                title="确定删除该节点吗?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDeleteF(data.id)">
                <template #reference>
                  <el-button type="text" size="small" style="margin-left: 8px">删除</el-button>
                </template>
              </el-popconfirm>
            </div>
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMessage } from '@/components/message'
import { CollegeAdmin } from '@/services/CollegeAdmin'
import type { TargetNode, TargetNodeTreeDTO } from '@/types'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { ref, toRef } from 'vue'
import { useRoute } from 'vue-router'

const message = useMessage()
const route = useRoute()
const catIdR = toRef(() => route.params.categoryId as string)

const { data: nodeRulesR } = CollegeAdmin.getAllNodeRulesService(catIdR)

const updateNodeRuleMutation = CollegeAdmin.updateNodeRuleService(catIdR) // 新增/修改节点规则
const deleteNodeRuleMutation = CollegeAdmin.deleteNodeRuleService(catIdR) // 删除节点
const dragNodeRuleMutation = CollegeAdmin.dragNodeRuleService(catIdR) // 拖拽节点

const dialogFormVisibleR = ref(false)
const dialogStatusR = ref('add') // add or edit
const formIns = ref<FormInstance>()

const addFormR = ref<TargetNode>({
  parentId: '',
  name: '',
  categoryId: '',
  maxMark: 0,
  maxNumber: 0,
  comment: ''
})

type openParams =
  | { status: 'add'; id: string; data?: never }
  | { status: 'edit'; id?: never; data: TargetNodeTreeDTO }

// 打开节点dialog
const openDialogF = (params: openParams) => {
  dialogFormVisibleR.value = true
  dialogStatusR.value = params.status
  if (params.status == 'add') {
    if (params.id === '1') {
      addFormR.value.parentId = null
    } else {
      addFormR.value.parentId = params.id as string
    }
    addFormR.value.name = ''
    addFormR.value.maxMark = undefined
    addFormR.value.maxNumber = undefined
    addFormR.value.comment = null
  } else {
    addFormR.value = { ...(params.data as TargetNode) }
  }
}

// 查看规则说明
const openCommentF = (comment: string) => {
  const formattedComment = comment.replace(/\n/g, '<br/>')
  ElMessageBox.alert(formattedComment, '规则说明', {
    confirmButtonText: 'OK',
    dangerouslyUseHTMLString: true // 关键：允许渲染 HTML 内容
  })
}

// 删除该节点以及所有子节点
const handleDeleteF = async (id: string) => {
  await deleteNodeRuleMutation.mutateAsync(id)
  message.success('删除成功!')
  addFormR.value.id = undefined
}

// 操作节点
const handleConfirmF = async () => {
  await formIns.value?.validate()
  await updateNodeRuleMutation.mutateAsync(addFormR.value)
  dialogFormVisibleR.value = false
  message.success('更新成功！')
  addFormR.value.id = undefined
}

// 关闭dialog
const handleCloseF = () => {
  dialogFormVisibleR.value = false
  formIns.value?.resetFields()
}

// 拖拽节点
const handleDragEndF = async (draggingNode: Node, dropNode: Node) => {
  if (draggingNode.data == dropNode.data) return
  await dragNodeRuleMutation.mutateAsync({
    nodeId: draggingNode.data.id,
    parentId: dropNode.data.id
  })
  message.success('指标移动成功!')
}

// 判断拖拽节点是否是目标节点的自身或后代
const isNodeSelfOrDescendantF = (draggingNode: Node, dropNode: Node): boolean => {
  if (draggingNode.data.id === dropNode.data.id) {
    return true
  }
  let currentNode = dropNode
  while (currentNode.parent) {
    currentNode = currentNode.parent
    if (currentNode.data.id === draggingNode.data.id) {
      return true
    }
  }
  return false
}

// 判断允许
const allowDropF = (draggingNode: Node, dropNode: Node, dropType: 'before' | 'after' | 'inner') => {
  const isInnerDrop = dropType === 'inner'
  const isLegalTarget = !isNodeSelfOrDescendantF(draggingNode, dropNode)
  return isInnerDrop && isLegalTarget
}

const rules = ref({
  name: [
    { required: true, message: '请输入指标名称', trigger: ['blur', 'change'] },
    { max: 100, message: '指标名称最多100个字符', trigger: ['blur', 'change'] }
  ],
  maxMark: [{ required: true, message: '请输入上限分数', trigger: ['blur', 'change'] }],
  comment: [{ max: 800, message: '规则说明最多800个字符', trigger: ['blur', 'change'] }]
})
</script>
<style scoped>
.main-container {
  min-height: calc(100vh - 64px);
}
.hover-shadow {
  min-height: calc(100vh - 200px);
  overflow: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
}
</style>
