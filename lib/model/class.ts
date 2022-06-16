import { Course, Schedule } from './course'
import { Response } from './common'

export interface CourseWithSchedule extends Course {
  schedule: Schedule
}

export interface GetClassScheduleRequest {
  userId: number
}

export type GetClassScheduleResponse = Response<CourseWithSchedule[]>
