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
            新增导师
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 专业dialog -->
    <el-dialog
      v-model="dialogFormVisibleR"
      :title="dialogStatusR == 'add' ? '添加导师' : '修改导师'"
      @close="handleCloseF"
      width="400">
      <el-form :model="addFormR" :rules="rules" ref="formIns">
        <el-form-item label="导师账号" prop="account">
          <el-input autocomplete="off" v-model="addFormR.account" />
        </el-form-item>
        <el-form-item label="导师名称" prop="name">
          <el-input autocomplete="off" v-model="addFormR.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisibleR = false">取消</el-button>
          <el-button type="primary" @click="handleConfirmF">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 导师列表 -->
    <el-table
      class="w-full mt-8 bg-white border-gray shadow-sm rounded-xl hover-shadow"
      :data="teacherListR"
      stripe
      style="width: 100%; border-width: 1px"
      height="690"
      empty-text="暂无专业数据，请添加或刷新">
      <el-table-column prop="account" label="导师账号">
        <template #default="scope">
          <span class="font-medium">{{ scope.row.account }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="导师名称">
        <template #default="scope">
          <span class="font-medium">{{ scope.row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column prop="categorys" label="管理类别">
        <template #default="scope">
          <div v-if="scope.row.categorys.length === 0" class="text-gray-400 text-sm">
            暂无管理类别
          </div>

          <div v-else class="admin-list">
            <span v-for="(cat, index) in scope.row.categorys" :key="cat.id" class="admin-item">
              {{ cat.name }}
              <span v-if="index < scope.row.categorys.length - 1" class="separator mx-1">&</span>
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" plain>
            <Stamp style="width: 1em; height: 1em; margin-right: 4px" />
            分配类别
          </el-button>
          <el-button type="primary" plain @click="openDialogF('edit', scope.row)">
            <EditPen style="width: 1em; height: 1em; margin-right: 4px" />
            修改导师
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
import type { Userx } from '@/types'
import { DeleteFilled, EditPen, Plus, RefreshRight, Search, Stamp } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

const message = useMessage()
const dialogFormVisibleR = ref(false)
const dialogStatusR = ref('add') // add or edit
const formIns = ref<FormInstance>()
const editId = ref()

const { data: teacherListR } = CollegeAdmin.getTeachersCatsService() // 获取导师及其管理类别

const addFormR = ref({
  account: '',
  name: ''
})

const addTeacherMutation = CollegeAdmin.addTeacherService() // 添加导师
const updateTeacherMutation = CollegeAdmin.updateTeacherService() // 修改导师
const deleteTeacherMutation = CollegeAdmin.deleteTeacherService() // 删除导师

// 打开导师dialog
const openDialogF = (status: string, data?: Userx) => {
  dialogFormVisibleR.value = true
  dialogStatusR.value = status
  if (status == 'add') {
    addFormR.value.account = ''
    addFormR.value.name = ''
  } else {
    editId.value = data?.id
    addFormR.value.account = data?.account as string
    addFormR.value.name = data?.name as string
  }
}

// 操作导师
const handleConfirmF = async () => {
  await formIns.value?.validate()
  if (dialogStatusR.value === 'edit') {
    await updateTeacherMutation.mutateAsync({ teacherId: editId.value, user: addFormR.value })
    dialogFormVisibleR.value = false
    message.success('修改成功！')
    return
  } else {
    await addTeacherMutation.mutateAsync(addFormR.value)
    dialogFormVisibleR.value = false
    message.success('添加成功！')
  }
}

// 删除导师
const handleDeleteF = async (id: string) => {
  await deleteTeacherMutation.mutateAsync(id)
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
    { required: true, message: '请输入专业名称', trigger: 'blur' },
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
