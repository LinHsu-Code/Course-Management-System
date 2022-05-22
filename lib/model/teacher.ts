import { Response, Paginator } from './common'
export interface CourseTeacher {
  createdAt: Date
  updatedAt: Date
  id: number
  country: string
  courseAmount: number
  email: string
  name: string
  phone: string
  profileId: number
}

export interface Teacher extends CourseTeacher {
  skills: Skill[]
}

export interface Skill {
  name: string
  level: number
}

export interface GetTeachersRequest {
  query?: string
  page?: number
  limit?: number
}

export interface Teachers {
  total: number
  teachers: Teacher[]
  paginator: Paginator
}

export type GetTeachersResponse = Response<Teachers>
