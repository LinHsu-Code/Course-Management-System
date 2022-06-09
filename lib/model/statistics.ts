import { Response } from './common'

export interface Overview {
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

export type GetOverviewResponse = Response<Overview>
