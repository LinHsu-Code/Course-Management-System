import { CourseType, StudentCourse } from './course'

export interface ListStudent {
  createdAt: Date
  updatedAt: Date
  id: number
  email: string
  name: string
  type?: StudentType
  country: string
  profileId?: number
  courses?: CourseType[]
}

export interface AddStudentRequest {
  email: string
  name: string
  type: 1 | 2
  country: string
}
export interface StudentType {
  id: 1 | 2
  name: 'Tester' | 'Developer'
}

export interface Student {
  createdAt: Date
  updatedAt: Date
  id: number
  email: string
  name: string
  country?: string
  profileId?: number
  address?: string
  age?: number
  avatar?: string
  description?: string
  education?: string
  gender?: number
  memberEndAt?: Date
  memberStartAt?: Date
  phone?: string
  type?: StudentType
  courses?: StudentCourse[]
  interest?: string[]
}
