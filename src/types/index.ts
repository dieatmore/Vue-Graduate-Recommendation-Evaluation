export interface ResultVO {
  code: number
  message?: string
  data: any
}

export enum Role {
  ADMIN = 'uQ7i', // 超级管理员
  COLLAGE_ADMIN = '6fT4', // 学院管理员
  TEACHER = 'Dp4L', // 导师
  STUDENT = 'po8V' // 学生
}

// 用户
export interface Userx {
  id?: string
  account?: string
  password?: string
  name?: string
  phone?: string
  role?: string
  collegeId?: string
  categoryId?: string
  majorId?: string
  createTime?: string
  updateTime?: string
}

// 学院
export interface College {
  id?: string
  name?: string
  createTime?: string
  insertTime?: string
}

// 类别
export interface Category {
  id?: string
  name?: string
  collegeId?: string
  weight?: string
  createTime?: string
  insertTime?: string
}

// 专业
export interface Major {
  id?: string
  name?: string
  categoryId?: string
  createTime?: string
  insertTime?: string
}

// 学院和学院管理员
export interface CollegeAndAdmin {
  id: string
  name?: string
  Users?: Userx[]
}

// 规则节点树
export interface TargetNodeTreeDTO {
  id?: string
  parentId: string | null
  name: string
  categoryId: string
  maxMark: number
  maxNumber?: number
  comment?: string | null
  children?: TargetNodeTreeDTO[]
}

// 规则节点
export interface TargetNode {
  id?: string
  parentId: string | null
  name: string
  categoryId: string
  maxMark: number | undefined
  maxNumber?: number | null
  comment?: string | null
  createTime?: string
  updateTime?: string
}
