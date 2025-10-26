<template>
  <div class="w-full main-container bg-[#F9FAFB] py-4 px-8">
    <!-- 功能栏 -->
    <div
      class="h-[10%] mt-4 bg-white p-4 rounded-xl flex justify-evenly border-gray shadow-sm hover-shadow"
      style="border-width: 1px">
      <el-form :inline="true" class="demo-form-inline mt-2" :model="formInlineR">
        <el-form-item label="学院名称">
          <el-input
            v-model="formInlineR.collegeName"
            placeholder="请输入学院名称"
            clearable
            style="width: 240px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmitF">
            <Search style="width: 1em; height: 1em; margin-right: 4px" />
            搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetSearchF">
            <RefreshRight style="width: 1em; height: 1em; margin-right: 4px" />
            重置
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" class="flex ml-4" @click="openDialogF('add')">
            <Plus style="width: 1em; height: 1em; margin-right: 4px" />
            新增学院
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 学院dialog -->
    <el-dialog
      v-model="dialogFormVisibleR"
      :title="dialogStatusR == 'add' ? '添加学院' : '修改学院'"
      @close="handleCloseF"
      width="400">
      <el-form :model="addFormR" :rules="rulesCol" ref="formColIns">
        <el-form-item label="学院名称" prop="name">
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

    <!-- 学院管理员dialog -->
    <el-dialog
      v-model="dialogAdminFormVisibleR"
      :title="dialogAdminStatusR == 'add' ? '添加管理员' : '修改管理员'"
      @close="handleCloseF"
      width="400">
      <el-form :model="addAdminFormR" :rules="rules" ref="formIns">
        <el-form-item label="管理员账号" prop="account">
          <el-input autocomplete="off" v-model="addAdminFormR.account" />
        </el-form-item>
        <el-form-item label="管理员名称" prop="name">
          <el-input autocomplete="off" v-model="addAdminFormR.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-popconfirm
            title="确定删除该管理员吗?"
            v-if="dialogAdminStatusR == 'edit'"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDeleteAdminF">
            <template #reference>
              <el-button type="danger">删除该管理员</el-button>
            </template>
          </el-popconfirm>
          <el-button @click="dialogAdminFormVisibleR = false">取消</el-button>
          <el-button type="primary" @click="handleAdminConfirmF">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 学院列表 -->
    <el-table
      class="w-full mt-8 bg-white border-gray shadow-sm rounded-xl hover-shadow"
      :data="dataListR"
      stripe
      style="width: 100%; border-width: 1px"
      height="690"
      empty-text="暂无学院数据，请添加或刷新">
      <el-table-column prop="name" label="学院名称">
        <template #default="scope">
          <span class="font-medium">{{ scope.row.name }}</span>
          <el-button
            type="success"
            class="flex ml-2"
            size="medium"
            plain
            @click="openAdminDialogF('add', scope.row.id)">
            <Plus style="width: 0.8em; height: 0.8em" class="mr-1" />
            <span style="font-size: smaller">学院管理员</span>
          </el-button>
        </template>
      </el-table-column>

      <el-table-column label="学院管理员">
        <template #default="scope">
          <div v-if="scope.row.users.length === 0" class="text-gray-400 text-sm">暂无管理员</div>

          <div v-else class="admin-list">
            <span v-for="(admin, index) in scope.row.users" :key="admin.id" class="admin-item">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="点击查看/修改管理员信息"
                placement="top">
                <el-button
                  type="info"
                  :icon="Edit"
                  size="small"
                  @click="openAdminDialogF('edit', scope.row.id, scope.row.users[index])">
                  {{ admin.name }}
                </el-button>
              </el-tooltip>
              <span v-if="index < scope.row.users.length - 1" class="separator mx-1">&</span>
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="primary" plain @click="openDialogF('edit', scope.row)">
            <EditPen style="width: 1em; height: 1em; margin-right: 4px" />
            修改学院
          </el-button>
          <el-popconfirm
            title="确定删除该学院吗?"
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
import { Admin } from '@/services/Admin'
import type { CollegeAndAdmin, Userx } from '@/types'
import { DeleteFilled, Edit, EditPen, Plus, RefreshRight, Search } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { ref, watch } from 'vue'

const message = useMessage()
const formIns = ref<FormInstance>()
const formColIns = ref<FormInstance>()
const dialogFormVisibleR = ref(false)
const dialogAdminFormVisibleR = ref(false)
const dialogStatusR = ref('add') // add or edit
const dialogAdminStatusR = ref('add') // add or edit
const thisCollegeAndAdminR = ref<CollegeAndAdmin>() // 当前操作的学院和管理员
const thisIdR = ref('') // 当前操作的学院id
const thisAdminR = ref<Userx>() // 当前操作的管理员
const collegeNameR = ref('')

const formInlineR = ref({
  collegeName: ''
})

const addFormR = ref({
  name: ''
})

const addAdminFormR = ref({
  account: '',
  name: ''
})

const dataListR = ref([])

// 获取学院和学院管理员列表
const { data: allListR, refetch: refetchAllList } = Admin.CollegesAndAdminsService()
watch(
  () => allListR.value,
  newVal => {
    if (newVal) {
      dataListR.value = newVal
    }
  },
  { immediate: true }
)

// 根据名字搜索学院
const { data: collegeByNameR } = Admin.SearchCollegeService(collegeNameR)
watch(
  () => collegeByNameR.value,
  newVal => {
    if (newVal.length === 0) {
    } else {
      dataListR.value = newVal
    }
  }
)

// 提交学院名字
const onSubmitF = () => {
  if (!formInlineR.value.collegeName) {
    message.warning('请输入学院名称') // 空值校验
    return
  }
  collegeNameR.value = formInlineR.value.collegeName
}

// 重置所有学院
const resetSearchF = async () => {
  formInlineR.value.collegeName = ''
  collegeNameR.value = ''
  if (allListR.value) {
    dataListR.value = allListR.value
  } else {
    refetchAllList()
  }
}

const addMutation = Admin.addCollegeService() // 添加学院
const editMutation = Admin.editCollegeService() // 修改学院
const deleteMutation = Admin.deleteCollegeService() // 修改学院
const addCollegeAdminMutation = Admin.addCollegeAdminService() // 添加学院管理员
const editCollegeAdminMutation = Admin.editCollegeAdminService() // 修改学院管理员
const deleteCollegeAdminMutation = Admin.deleteCollegeAdminService() // 删除学院管理员

// 操作学院
const handleConfirmF = async () => {
  await formColIns.value?.validate()
  if (dialogStatusR.value === 'edit') {
    await editMutation.mutateAsync({
      id: thisCollegeAndAdminR.value?.id as string,
      data: addFormR.value
    })
    dialogFormVisibleR.value = false
    message.success('修改成功！')
  } else {
    await addMutation.mutateAsync(addFormR.value)
    dialogFormVisibleR.value = false
    message.success('添加成功！')
  }
}

// 操作管理员
const handleAdminConfirmF = async () => {
  await formIns.value?.validate()
  if (dialogAdminStatusR.value === 'edit') {
    await editCollegeAdminMutation.mutateAsync({
      id: thisAdminR.value?.id as string,
      data: addAdminFormR.value
    })
    dialogAdminFormVisibleR.value = false
    message.success('修改成功！')
  } else {
    await addCollegeAdminMutation.mutateAsync({
      id: thisIdR.value as string,
      data: addAdminFormR.value
    })
    dialogAdminFormVisibleR.value = false
    message.success('添加成功！')
  }
}

// 删除管理员
const handleDeleteAdminF = async () => {
  await deleteCollegeAdminMutation.mutateAsync(thisAdminR.value?.id as string)
  dialogAdminFormVisibleR.value = false
  message.success('删除成功！')
}

// 删除学院
const handleDeleteF = async (id: string) => {
  await deleteMutation.mutateAsync(id)
  message.success('删除成功!')
}

// 关闭dialog
const handleCloseF = () => {
  formIns.value?.resetFields()
  formColIns.value?.resetFields()
  dialogFormVisibleR.value = false
  dialogAdminFormVisibleR.value = false
  addFormR.value.name = ''
  addAdminFormR.value.account = ''
  addAdminFormR.value.name = ''
}

// 打开学院dialog
const openDialogF = (status: string, data?: CollegeAndAdmin) => {
  dialogFormVisibleR.value = true
  dialogStatusR.value = status
  if (status == 'add') addFormR.value.name = ''
  else addFormR.value.name = data?.name as string
  if (data) thisCollegeAndAdminR.value = data
}

// 打开学院管理员dialog
const openAdminDialogF = (status: string, collegeId?: string, data?: Userx) => {
  dialogAdminFormVisibleR.value = true
  dialogAdminStatusR.value = status
  if (status == 'add') {
    addAdminFormR.value.account = ''
    addAdminFormR.value.name = ''
    thisIdR.value = collegeId as string
  } else {
    addAdminFormR.value.account = data?.account as string
    addAdminFormR.value.name = data?.name as string
    if (data) thisAdminR.value = data
  }
}

// 管理员表单验证规则
const rules = ref({
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 10, max: 10, message: '用户名长度为10个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在2到10个字符', trigger: 'blur' }
  ]
})

// 学院表单验证规则
const rulesCol = ref({
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
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
:deep(.el-form-item__label::before) {
  content: none !important;
}
</style>
