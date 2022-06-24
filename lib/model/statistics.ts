import { Response } from './common'
import { Course } from './course'
export interface StatisticsOverview {
  course: OverviewDetail
  student: OverviewDetailWithGender
  teacher: OverviewDetailWithGender
}
export interface OverviewDetail {
  lastMonthAdded: number
  total: number
}

export interface OverviewDetailWithGender extends OverviewDetail {
  gender: Gender
}

export interface Gender {
  unknown: number
  male: number
  female: number
}

export type GetStatisticsOverviewResponse = Response<StatisticsOverview>

export interface Statistics {
  name: string
  amount: number
}

export interface StudentStatistics {
  country: Statistics[]
  type: Statistics[]
  courses: Statistics[]
  createdAt: Statistics[]
  interest: Statistics[]
}

export type GetStudentStatisticsResponse = Response<StudentStatistics>

export interface StatisticsWithSkill extends Statistics {
  level: number
}
export interface TeacherStatistics {
  country: Statistics[]
  createdAt: Statistics[]
  skills: { [key: string]: StatisticsWithSkill[] }
  workExperience: string[]
}

export interface TeacherStatisticsGetByTeacher {
  type: Statistics[]
  createdAt: Statistics[]
  classTime: ClassTime[]
  status: Statistics[]
}

export interface ClassTime {
  name: string
  amount: number
  courses: ClassTimeCourseDetail[]
}

export interface ClassTimeCourseDetail {
  classTime: string[] | null
  typeName: string
  name: string
}

export type GetTeacherStatisticsResponse = Response<
  TeacherStatistics | TeacherStatisticsGetByTeacher
>

export interface CourseWithClassTime {
  classTime: string[] | null
  typeName: string
  name: string
}
export interface StatisticsWithClassTime extends Statistics {
  courses: CourseWithClassTime[]
}

export interface CourseStatistics {
  type: Statistics[]
  createdAt: Statistics[]
  classTime: StatisticsWithClassTime[]
}

export type GetCourseStatisticsResponse = Response<CourseStatistics>

export interface GetStudentStatisticsRequest {
  userId: number
}

export interface StudentStatisticsByStudent {
  own: Own
  recommend: Recommend
}

export interface Own {
  name: string
  amount: number
  courses: OwnCourse[]
}

export interface Recommend {
  name: string
  amount: number
  courses: StatisticsCourseDetail[]
}

export interface OwnCourse {
  createdAt: Date
  updatedAt: Date
  id: number
  courseDate: Date
  studentId: number
  course: StatisticsCourseDetail
}

export type StatisticsCourseDetail = Omit<Course, 'teacherName'> & {
  teacherName?: string
}

export type GetStudentStatisticsByStudentResponse =
  Response<StudentStatisticsByStudent>
