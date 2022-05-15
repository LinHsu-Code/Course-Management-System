import { Response, Paginator } from './common'
export interface CourseType {
  id: number
  name: string
  courseId?: number
}

export interface StudentDetailCourse {
  createdAt: Date
  updatedAt: Date
  id: number
  courseDate: Date
  studentId: number
  name: string
  courseId: number
  type: CourseType[]
}

export interface GetCoursesRequest {
  page?: number
  limit?: number
  name?: string
  type?: string
  uid?: string
  userId?: string
}

export interface Course {
  createdAt: Date
  updatedAt: Date
  id: number
  cover: string
  detail: string
  duration: number
  durationUnit: number
  maxStudents: number
  name: string
  price: number
  uid: string
  star: number
  startTime: Date
  status: number
  scheduleId: number
  teacherId: number
  type: CourseType[]
  teacherName: string
}

export interface Courses {
  total: number
  students: Course[]
  paginator: Paginator
}
export type GetCoursesResponse = Response<Courses>
