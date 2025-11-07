import { useGet } from '@/axios'
import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { querycachename } from './Const'

// 获取学生统计列表
const getStudentsListService = (categoryId: Ref, majorId: Ref) => {
  return useQuery({
    queryKey: [querycachename.college.studentslist, majorId],
    queryFn: () => useGet(`teacher/categorys/${categoryId.value}/majors/${majorId.value}/students`)
  })
}

// 获取某个学生具体信息
const getStudentDetailService = (studentId: Ref) => {
  return useQuery({
    queryKey: [querycachename.college.studentdetail, studentId],
    queryFn: () => useGet(`teacher/students/${studentId.value}`)
  })
}

// 获取某个学生个人信息
const getStudentInfoService = (studentId: Ref) => {
  return useQuery({
    queryKey: [querycachename.college.studentinfo, studentId],
    queryFn: () => useGet(`teacher/students/${studentId.value}/info`)
  })
}

export const Teacher = {
  getStudentsListService,
  getStudentDetailService,
  getStudentInfoService
}
