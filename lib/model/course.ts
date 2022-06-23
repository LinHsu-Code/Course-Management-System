import { Response, Paginator } from './common'
import { CourseTeacher } from './teacher'
export interface CourseType {
  id: number
  name: string
  courseId?: number
}

export interface StudentCourseType extends CourseType {
  courseId: number
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
  courses: Course[]
  paginator: Paginator
}
export type GetCoursesResponse = Response<Courses>

export type GetCourseRequest = { id: string }

export interface CourseDetail extends Course {
  teacher: CourseTeacher
  schedule: Schedule
  sales: Sales
}
export type GetCourseResponse = Response<CourseDetail>

export interface Sales {
  createdAt: Date
  updatedAt: Date
  id: number
  batches: number
  price: number
  earnings: number
  paidAmount: number
  studentAmount: number
  paidIds: number[]
}

export interface Schedule {
  createdAt: Date
  updatedAt: Date
  id: number
  status: number
  current: number
  classTime: string[]
  chapters: Chapter[]
}

export interface Chapter {
  createdAt: Date
  updatedAt: Date
  id: number
  name: string
  order: number
  content: string
}

export interface ScheduleTime {
  Sunday: string
  Monday: string
  Tuesday: string
  Wednesday: string
  Thursday: string
  Friday: string
  Saturday: string
}

export interface ScheduleTableData extends ScheduleTime {
  key: string
}

export type Weekday = keyof ScheduleTime

export type GetCourseTypesResponse = Response<CourseType[]>

export type GenerateCourseCodeResponse = Response<string>

export type AddCourseRequest = Pick<
  Course,
  | 'cover'
  | 'detail'
  | 'duration'
  | 'durationUnit'
  | 'maxStudents'
  | 'name'
  | 'price'
  | 'startTime'
  | 'uid'
  | 'teacherId'
> & { type: number[] }

export type AddCourseResponse = Response<Course>

export interface UpdateCourseScheduleRequest {
  chapters: Pick<Chapter, 'content' | 'name' | 'order'>[]
  classTime: string[]
  scheduleId?: number
  courseId?: number
}

export type UpdateCourseScheduleResponse = Response<boolean>

export type CourseScheduleFormValues = {
  chapters: Pick<Chapter, 'content' | 'name'>[]
  classTime: {
    weekday: string
    time: Date
  }[]
}

export type CourseSearchBy = 'uid' | 'name' | 'type'

export interface UpdateCourseRequest extends AddCourseRequest {
  id: number
}

export type UpdateCourseResponse = Response<CourseDetail>

export interface GetCourseScheduleRequest {
  courseId?: number
  scheduleId?: number
}
export type GetCourseScheduleResponse = Response<Schedule>

export type DeleteCourseRequest = number

export type DeleteCourseResponse = Response<boolean>

export interface CourseWithSchedule extends Course {
  schedule: Schedule
}

export interface GetClassScheduleRequest {
  userId: number
}

export type GetClassScheduleResponse = Response<CourseWithSchedule[]>
