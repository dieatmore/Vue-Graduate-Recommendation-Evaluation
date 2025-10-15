<template>
  <div class="w-full main-container bg-[#F9FAFB] py-4 px-8">
    <div
      class="h-full mt-4 bg-white p-4 rounded-xl flex border-gray shadow-sm"
      style="border-width: 1px">
      <el-button type="success" class="flex ml-4" @click="openDialog({ status: 'add', id: '1' })">
        <Plus style="width: 1em; height: 1em; margin-right: 4px" />
        新增一级指标节点
      </el-button>
    </div>

    <!-- 节点dialog -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="dialogStatus == 'add' ? '添加类别' : '修改类别'"
      width="400">
      <el-form :model="addForm" ref="formRef">
        <el-form-item label="指标名称" prop="name">
          <el-input autocomplete="off" v-model="addForm.name" />
        </el-form-item>
        <el-form-item label="上限分数" prop="maxMark">
          <el-input-number v-model="addForm.maxMark" :min="0.1" :max="90" />
        </el-form-item>
        <el-form-item label="最大项数" prop="maxNumber">
          <el-input-number v-model="addForm.maxNumber" :min="0" :max="10" placeholder="(选填)" />
        </el-form-item>
        <el-form-item label="规则说明" prop="comment">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4 }"
            autocomplete="off"
            placeholder="(选填)"
            v-model="addForm.comment" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <div
      class="h-full mt-4 bg-white p-4 rounded-xl flex justify-evenly border-gray shadow-sm hover-shadow"
      style="border-width: 1px">
      <el-tree
        class="w-full"
        :data="nodeRules"
        node-key="id"
        draggable
        @node-drag-end="handleDragEnd"
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
                @click="openComment(data.comment)">
                查看规则说明
              </el-button>
              <el-button
                type="text"
                size="small"
                style="margin-left: 8px"
                @click="openDialog({ status: 'add', id: data.id })">
                添加
              </el-button>
              <el-button
                type="text"
                size="small"
                style="margin-left: 8px"
                @click="openDialog({ status: 'edit', data: data })">
                修改
              </el-button>
              <el-popconfirm
                title="确定删除该节点吗?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete(data.id)">
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
import { useNodeRulesStore } from '@/stores/NodeRuleStore'
import type { TargetNode, TargetNodeTreeDTO } from '@/types'
import { Plus } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ElMessageBox } from 'element-plus'
import type Node from 'element-plus/es/components/tree/src/model/node'
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const message = useMessage()
const route = useRoute()
const nodeRuleStore = useNodeRulesStore() // 节点规则store
const dialogFormVisible = ref(false)
const dialogStatus = ref('add') // add or edit
const formRef = ref<FormInstance>()

const addForm = ref<TargetNode>({
  parentId: '',
  name: '',
  categoryId: '',
  maxMark: 0,
  maxNumber: 0,
  comment: ''
})

const nodeRules = computed(() => {
  return nodeRuleStore.nodeRulesS.value?.[route.params.categoryId as string]
})

CollegeAdmin.getAllNodeRulesService(route.params.categoryId as string) // 初始化
watch(
  () => route.params.categoryId,
  async newVal => {
    if (newVal) {
      await CollegeAdmin.getAllNodeRulesService(newVal as string)
    }
  },
  { immediate: true }
)

type openParams =
  | { status: 'add'; id: string; data?: never }
  | { status: 'edit'; id?: never; data: TargetNodeTreeDTO }

// 打开节点dialog
const openDialog = (params: openParams) => {
  dialogFormVisible.value = true
  dialogStatus.value = params.status
  if (params.status == 'add') {
    if (params.id === '1') {
      addForm.value.parentId = null
    } else {
      addForm.value.parentId = params.id as string
    }
    addForm.value.name = ''
    addForm.value.maxMark = null as unknown as number
    addForm.value.maxNumber = null as unknown as number
    addForm.value.comment = null
  } else {
    console.log(params.data)
    addForm.value = { ...(params.data as TargetNode) }
    console.log(addForm.value)
  }
}

// 查看规则说明
const openComment = (comment: string) => {
  ElMessageBox.alert(`${comment}`, '规则说明', {
    // if you want to disable its autofocus
    // autofocus: false,
    confirmButtonText: 'OK'
  })
}

// 删除该节点以及所有子节点
const handleDelete = async (id: string) => {
  await CollegeAdmin.deleteNodeRuleService(route.params.categoryId as string, id)
  message.success('删除成功!')
}

// 操作节点
const handleConfirm = async () => {
  const formRule = await formRef.value?.validate()
  if (!formRule) return
  await CollegeAdmin.updateNodeRuleService(route.params.categoryId as string, addForm.value)
  dialogFormVisible.value = false
  message.success('更新成功！')
}

// 拖拽节点
const handleDragEnd = async (draggingNode: Node, dropNode: Node) => {
  if (draggingNode.data == dropNode.data) return
  await CollegeAdmin.dragNodeRuleService(
    route.params.categoryId as string,
    draggingNode.data.id,
    dropNode.data.id
  )
  message.success('指标移动成功!')
}
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
