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
            :disabled="studentInfoR?.status == 1"
            :type="studentInfoR?.status == 0 ? 'primary' : 'default'"
            size="mini"
            class="status-btn float-right mr-4">
            完善个人信息
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

    <!-- 详细信息 -->
    <div
      class="h-[20%] mt-4 bg-white p-4 rounded-xl justify-evenly border-gray shadow-sm hover-shadow"
      style="border-width: 1px">
      <div class="flex">
        <span class="el-descriptions__title">学生具体信息</span>
        <div class="mx-auto flex items-center">
          <el-text tag="ins" class="text-red-500 font-bold">
            所有评价认定指标、分数限定、项限定等，以《学院推荐免试攻读研究生全面发展成绩指标》文件为准！所有成绩，已学院审核认定为准！
          </el-text>
        </div>
      </div>
      <div class="mt-16 ml-4 flex">
        <div>
          <el-descriptions :column="1">
            <el-descriptions-item label-align="left" label="已认定成绩" class="mt-4">
              <el-tag type="primary" effect="dark" round size="large">
                {{ detailInfoR?.confirmed_score || '暂无信息' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label-align="left" label="已认定项数" class="mt-4">
              <el-tag type="success" round>
                {{ detailInfoR?.confirmed_items || '暂无信息' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label-align="left" label="待审核项数">
              <el-tag type="warning" round>
                {{ detailInfoR?.pending_items || '暂无信息' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label-align="left" label="待修改项数">
              <el-tag type="info" round>
                {{ detailInfoR?.modify_items || '暂无信息' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label-align="left" label="已驳回项数">
              <el-tag type="error" round>
                {{ detailInfoR?.rejected_items || '暂无信息' }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label-align="left" label="总提交项数">
              <el-tag>{{ detailInfoR?.total_items || '暂无信息' }}</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="mx-auto flex items-center">
          <el-text size="large" class="font-bold" tag="mark">
            当前总成绩：
            <el-tag type="primary" effect="dark" round>{{ resultScore }}</el-tag>
            =
            {{ categoryInfoR?.weight[0].scoreName || '暂无' }}:
            <el-tag type="primary" effect="dark" round>
              {{ studentInfoR?.scorex || '暂无' }}
            </el-tag>
            *
            {{ categoryInfoR?.weight[0].scoreWeight || '暂无' }}% +
            {{ categoryInfoR?.weight[1].scoreName || '暂无' }}:
            <el-tag type="primary" effect="dark" round>
              {{ detailInfoR?.confirmed_score || '暂无' }}
            </el-tag>
            *
            {{ categoryInfoR?.weight[1].scoreWeight || '暂无' }}%
          </el-text>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Student } from '@/services/Student'
import { ref, toRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const studentIdR = toRef(() => route.params.studentId as string)

const { data: studentInfoR, suspense: suspenseInfo } = Student.getMyInfoService(studentIdR)
const { data: categoryInfoR, suspense: suspenseCat } = Student.getCategoryInfoService(studentIdR)
const { data: detailInfoR, suspense: suspenseDetail } = Student.getDetailInfoService(studentIdR)
await suspenseInfo()
await suspenseCat()
await suspenseDetail()
const resultScore = ref(
  (studentInfoR.value.scorex * categoryInfoR?.value?.weight[0].scoreWeight) / 100 +
    (detailInfoR.value.confirmed_score * categoryInfoR?.value?.weight[1].scoreWeight) / 100
)
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
:deep(.el-descriptions__body .el-descriptions__table:not(.is-bordered) .el-descriptions__cell) {
  padding-bottom: 55px;
}
:deep(.el-descriptions__label:not(.is-bordered-label)) {
  font-size: large;
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
