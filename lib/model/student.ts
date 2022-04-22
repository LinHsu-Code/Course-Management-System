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

export interface StudentType {
  id: number
  name: string
}
