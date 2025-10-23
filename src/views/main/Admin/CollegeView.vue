<template>
  <div class="w-full main-container bg-[#F9FAFB] py-4 px-8">
    <!-- 功能栏 -->
    <div
      class="h-[10%] mt-4 bg-white p-4 rounded-xl flex justify-evenly border-gray shadow-sm hover-shadow"
      style="border-width: 1px">
      <el-form :inline="true" class="demo-form-inline mt-2" :model="formInline">
        <el-form-item label="学院名称">
          <el-input
            v-model="formInline.collegeName"
            placeholder="请输入学院名称"
            clearable
            style="width: 240px" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">
            <Search style="width: 1em; height: 1em; margin-right: 4px" />
            搜索
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="resetSearch">
            <RefreshRight style="width: 1em; height: 1em; margin-right: 4px" />
            重置
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="success" class="flex ml-4" @click="openDialog('add')">
            <Plus style="width: 1em; height: 1em; margin-right: 4px" />
            新增学院
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 学院dialog -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="dialogStatus == 'add' ? '添加学院' : '修改学院'"
      @close="handleClose"
      width="400">
      <el-form :model="addForm" :rules="rulesCol" ref="formColRef">
        <el-form-item label="学院名称" prop="name">
          <el-input autocomplete="off" v-model="addForm.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 学院管理员dialog -->
    <el-dialog
      v-model="dialogAdminFormVisible"
      :title="dialogAdminStatus == 'add' ? '添加管理员' : '修改管理员'"
      @close="handleClose"
      width="400">
      <el-form :model="addAdminForm" :rules="rules" ref="formRef">
        <el-form-item label="管理员账号" prop="account">
          <el-input autocomplete="off" v-model="addAdminForm.account" />
        </el-form-item>
        <el-form-item label="管理员名称" prop="name">
          <el-input autocomplete="off" v-model="addAdminForm.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-popconfirm
            title="确定删除该管理员吗?"
            v-if="dialogAdminStatus == 'edit'"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDeleteAdmin">
            <template #reference>
              <el-button type="danger">删除该管理员</el-button>
            </template>
          </el-popconfirm>
          <el-button @click="dialogAdminFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleAdminConfirm">确认</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 学院列表 -->
    <el-table
      class="w-full mt-8 bg-white border-gray shadow-sm rounded-xl hover-shadow"
      :data="dataList"
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
            @click="openAdminDialog('add', scope.row.id)">
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
                  @click="openAdminDialog('edit', scope.row.id, scope.row.users[index])">
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
          <el-button type="primary" plain @click="openDialog('edit', scope.row)">
            <EditPen style="width: 1em; height: 1em; margin-right: 4px" />
            修改学院
          </el-button>
          <el-popconfirm
            title="确定删除该学院吗?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.row.id)">
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
const formRef = ref<FormInstance>()
const formColRef = ref<FormInstance>()
const dialogFormVisible = ref(false)
const dialogAdminFormVisible = ref(false)
const dialogStatus = ref('add') // add or edit
const dialogAdminStatus = ref('add') // add or edit
const thisCollegeAndAdmin = ref<CollegeAndAdmin>() // 当前操作的学院和管理员
const thisId = ref('') // 当前操作的学院id
const thisAdmin = ref<Userx>() // 当前操作的管理员
const collegeName = ref('')

const formInline = ref({
  collegeName: ''
})

const addForm = ref({
  name: ''
})

const addAdminForm = ref({
  account: '',
  name: ''
})

const dataList = ref([])

// 获取学院和学院管理员列表
const { data: allList, refetch: refetchAllList } = Admin.CollegesAndAdminsService()
watch(
  () => allList.value,
  newVal => {
    if (newVal) {
      dataList.value = newVal
    }
  },
  { immediate: true }
)

// 根据名字搜索学院
const { data: collegeByName } = Admin.SearchCollegeService(collegeName)
watch(
  () => collegeByName.value,
  newVal => {
    if (newVal.length === 0) {
      message.info('未找到匹配的学院')
    } else {
      dataList.value = newVal
      console.log('搜索到的：', dataList.value)
    }
  }
)

// 提交学院名字
const onSubmit = () => {
  if (!formInline.value.collegeName) {
    message.warning('请输入学院名称') // 空值校验
    return
  }
  collegeName.value = formInline.value.collegeName
}

// 重置所有学院
const resetSearch = async () => {
  formInline.value.collegeName = ''
  collegeName.value = ''
  if (allList.value) {
    dataList.value = allList.value
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
const handleConfirm = async () => {
  await formColRef.value?.validate()
  if (dialogStatus.value === 'edit') {
    await editMutation.mutateAsync({
      id: thisCollegeAndAdmin.value?.id as string,
      data: addForm.value
    })
    dialogFormVisible.value = false
    message.success('修改成功！')
  } else {
    await addMutation.mutateAsync(addForm.value)
    dialogFormVisible.value = false
    message.success('添加成功！')
  }
}

// 操作管理员
const handleAdminConfirm = async () => {
  await formRef.value?.validate()
  if (dialogAdminStatus.value === 'edit') {
    await editCollegeAdminMutation.mutateAsync({
      id: thisAdmin.value?.id as string,
      data: addAdminForm.value
    })
    dialogAdminFormVisible.value = false
    message.success('修改成功！')
  } else {
    await addCollegeAdminMutation.mutateAsync({
      id: thisId.value as string,
      data: addAdminForm.value
    })
    dialogAdminFormVisible.value = false
    message.success('添加成功！')
  }
}

// 删除管理员
const handleDeleteAdmin = async () => {
  await deleteCollegeAdminMutation.mutateAsync(thisAdmin.value?.id as string)
  dialogAdminFormVisible.value = false
  message.success('删除成功！')
}

// 删除学院
const handleDelete = async (id: string) => {
  await deleteMutation.mutateAsync(id)
  message.success('删除成功!')
}

// 关闭dialog
const handleClose = () => {
  dialogFormVisible.value = false
  dialogAdminFormVisible.value = false
  formRef.value?.resetFields()
  formColRef.value?.resetFields()
}

// 打开学院dialog
const openDialog = (status: string, data?: CollegeAndAdmin) => {
  dialogFormVisible.value = true
  dialogStatus.value = status
  if (status == 'add') addForm.value.name = ''
  else addForm.value.name = data?.name as string
  if (data) thisCollegeAndAdmin.value = data
}

// 打开学院管理员dialog
const openAdminDialog = (status: string, collegeId?: string, data?: Userx) => {
  dialogAdminFormVisible.value = true
  dialogAdminStatus.value = status
  if (status == 'add') {
    addAdminForm.value.account = ''
    addAdminForm.value.name = ''
    thisId.value = collegeId as string
  } else {
    addAdminForm.value.account = data?.account as string
    addAdminForm.value.name = data?.name as string
    if (data) thisAdmin.value = data
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
