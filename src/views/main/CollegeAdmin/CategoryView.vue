<template>
  <div class="w-full main-container bg-[#F9FAFB] py-4 px-8">
    <!-- 功能栏 -->
    <div
      class="h-[10%] mt-4 bg-white p-4 rounded-xl flex justify-evenly border-gray shadow-sm hover-shadow"
      style="border-width: 1px">
      <el-form :inline="true" class="demo-form-inline mt-2">
        <el-form-item label="类别名称">
          <el-input placeholder="请输入类别名称" clearable style="width: 240px" />
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
        <el-form-item>
          <el-button type="success" class="flex ml-4" @click="openDialogF('add')">
            <Plus style="width: 1em; height: 1em; margin-right: 4px" />
            新增类别
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 类别dialog -->
    <el-dialog
      v-model="dialogFormVisibleR"
      :title="dialogStatusR == 'add' ? '添加类别' : '修改类别'"
      @close="handleCloseF"
      width="400">
      <el-form :model="addFormR" :rules="rules" ref="formIns">
        <el-form-item label="类别名称" prop="name">
          <el-input autocomplete="off" v-model="addFormR.name" />
        </el-form-item>
        <el-form-item label="成绩配置">
          <el-button type="primary" size="small" @click="addScoreItem">添加成绩项</el-button>
        </el-form-item>
        <el-form-item>
          <div
            v-for="(item, index) in addFormR.weight"
            :key="index"
            class="score-item-row flex w-full mt-2">
            <el-form-item
              :prop="`weight[${index}].scoreName`"
              :rules="[{ required: true, message: '名称不能为空', trigger: 'blur' }]"
              label-width="40px"
              label="名称"
              class="score-item-col w-40">
              <el-input autocomplete="off" v-model="item.scoreName" />
            </el-form-item>

            <el-form-item
              :prop="`weight[${index}].scoreWeight`"
              :rules="[
                { required: true, message: '成绩占比不能为空', trigger: 'blur' },
                { type: 'number', message: '成绩占比必须为数字', trigger: 'blur' },
                { validator: validateWeight, trigger: 'blur' }
              ]"
              label-width="40px"
              label="占比"
              class="score-item-col w-40 ml-1">
              <el-input
                autocomplete="off"
                v-model.number="item.scoreWeight"
                placeholder="请输入1-100的数字"
                type="number"
                min="1"
                max="100" />
            </el-form-item>

            <el-button type="danger" @click="removeScoreItem(index)" class="score-item-delete ml-2">
              删除
            </el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisibleR = false">取消</el-button>
          <el-button type="primary" :disabled="!isConfirmEnabled" @click="handleConfirmF">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 学院列表 -->
    <el-table
      class="w-full mt-8 bg-white border-gray shadow-sm rounded-xl hover-shadow"
      :data="categoryListR"
      stripe
      style="width: 100%; border-width: 1px"
      height="690"
      empty-text="暂无类别数据，请添加或刷新">
      <el-table-column prop="name" label="类别名称">
        <template #default="scope">
          <span class="font-medium">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="weight" label="成绩配置">
        <template #default="scope">
          <div v-for="(item, index) in scope.row.weight" :key="index" class="mb-1">
            <span class="font-medium">{{ item.scoreName }}:</span>
            <span>{{ item.scoreWeight }}%</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" plain @click="openDialogF('edit', scope.row)">
            <EditPen style="width: 1em; height: 1em; margin-right: 4px" />
            修改类别
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
  </div>
</template>
<script setup lang="ts">
import { useMessage } from '@/components/message'
import { CollegeAdmin } from '@/services/CollegeAdmin'
import { useUserStore } from '@/stores/UserStore'
import type { Category, weight } from '@/types'
import { DeleteFilled, EditPen, Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import { type FormInstance } from 'element-plus'
import { computed, ref, toRef } from 'vue'

const message = useMessage()
const userStore = useUserStore()
const user = userStore.UserS
const role = toRef(() => user.value?.role)

const { data: categoryListR } = CollegeAdmin.getCategoryService(role) // 初始化
console.log(categoryListR)
const dialogFormVisibleR = ref(false)
const dialogStatusR = ref('add') // add or edit
const formIns = ref<FormInstance>()
const editId = ref()
const addFormR = ref({
  name: '',
  weight: [] as weight[]
})

// 添加成绩项
const addScoreItem = () => {
  addFormR.value.weight.push({
    scoreName: '',
    scoreWeight: 0
  })
}

// 删除成绩项
const removeScoreItem = (index: any) => {
  addFormR.value.weight.splice(index, 1)
}

const addCategoryMutation = CollegeAdmin.addCategoryService() // 添加类别
const deleteCategoryMutation = CollegeAdmin.deleteCategoryService() // 删除类别
const updateCategoryMutation = CollegeAdmin.updateCategoryService() // 修改类别

// 打开类别dialog
const openDialogF = (status: string, data?: Category) => {
  dialogFormVisibleR.value = true
  dialogStatusR.value = status
  if (status == 'add') {
    addFormR.value.name = ''
    addFormR.value.weight = []
  } else {
    editId.value = data?.id
    addFormR.value.name = data?.name as string
    addFormR.value.weight = []
    for (const item of data?.weight as unknown as any[]) {
      addFormR.value.weight.push({
        scoreName: item.scoreName,
        scoreWeight: item.scoreWeight
      })
    }
  }
}

// 成绩占比验证函数（带 TS 类型）
const validateWeight = (rule: any, value: number, callback: (error?: Error) => void) => {
  if (value === undefined || value === null) {
    message.warning('成绩占比不能为空')
  } else if (value < 1 || value > 100) {
    message.error('1-100之间')
  } else {
    callback()
  }
}

// 转换表单类型
const resultFormR = computed(() => {
  return {
    name: addFormR.value.name,
    weight: JSON.stringify(addFormR.value.weight)
  }
})

// 操作类别
const handleConfirmF = async () => {
  await formIns.value?.validate()
  if (dialogStatusR.value === 'edit') {
    await updateCategoryMutation.mutateAsync({ categoryId: editId.value, cat: resultFormR.value })
    dialogFormVisibleR.value = false
    message.success('修改成功！')
    return
  } else {
    await addCategoryMutation.mutateAsync(resultFormR.value)
    dialogFormVisibleR.value = false
    message.success('添加成功！')
  }
}

// 计算占比总和
const weightTotal = computed(() => {
  return addFormR.value.weight.reduce((total, item) => {
    // 过滤非数字/空值，避免NaN
    const weight = Number(item.scoreWeight)
    return total + (isNaN(weight) ? 0 : weight)
  }, 0)
})

// 验证按钮是否可用（核心修正）
const isConfirmEnabled = computed(() => {
  // 条件2：占比总和严格等于100
  if (weightTotal.value != 100) return false

  return true
})
// 删除类别
const handleDeleteF = async (id: string) => {
  await deleteCategoryMutation.mutateAsync(id)
  message.success('删除成功!')
}

// 关闭dialog
const handleCloseF = () => {
  dialogFormVisibleR.value = false
  formIns.value?.resetFields()
}

// 学院表单验证规则
const rules = ref({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在2到10个字符', trigger: 'blur' }
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
</style>
