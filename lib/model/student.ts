import { CourseType } from './course'

export interface Student {
  createdAt: Date
  updatedAt: Date
  id: number
  email: string
  name: string
  type: StudentType
  country: string
  profileId?: number
  courses?: CourseType[]
}

export interface AddStudent {
  email: string
  name: string
  type: 1 | 2
  country: string
}
export interface StudentType {
  id: number
  name: string
}
