import { StudentCourseType, StudentDetailCourse } from './course'
import { Response, Paginator } from './common'

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
  type: StudentType | null
  country: string
  profileId: number
  courses: StudentCourseType[]
}

export interface GetStudentsRequest {
  query?: string
  userId?: number
  page: number
  limit: number
}

export interface Students {
  total: number
  students: Student[]
  paginator: Paginator
}

export type GetStudentsResponse = Response<Students>
export interface AddStudentRequest {
  email: string
  name: string
  type: 1 | 2
  country: string
}

export type AddStudentsResponse = Response<Student>

export interface EditStudentRequest extends AddStudentRequest {
  id: number
}
export type EditStudentsResponse = Response<Student>

export type DeleteStudentRequest = number

export type DeleteStudentResponse = Response<boolean>

// export type GetStudentRequest = string
export type GetStudentRequest = number

export interface StudentDetail extends Student {
  address: string[] | null
  age: number
  avatar: string
  description: string
  education: string
  gender: number
  memberEndAt: Date
  memberStartAt: Date
  phone: string
  type: StudentType
  courses: StudentDetailCourse[]
  interest: string[]
}
export type GetStudentResponse = Response<StudentDetail>
