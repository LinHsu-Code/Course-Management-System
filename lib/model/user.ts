import { Response } from './common'
import { Skill } from './teacher'
export interface LoginRequest {
  role: string
  email: string
  remember: boolean
  password: string
}

export interface LoginResult {
  token: string
  role: string
  userId: number
}

export type LoginResponse = Response<LoginResult>

export type LogoutResponse = Response<boolean>

export interface GetProfileRequest {
  userId: number
}

export interface TeacherProfile {
  createdAt: Date
  updatedAt: Date
  id: number
  address: string[]
  gender: number
  //birthday: Date
  birthday: string
  avatar: string
  description: string
  country: string
  courseAmount: number
  email: string
  name: string
  phone: string
  profileId: number
  skills: SkillWithId[]
  workExperience: WorkExperience[]
  education: Education[]
}

export interface Education {
  startAt: Date
  endAt: Date
  id: number
  level: number
  degree: string
  startEnd: string
}

export interface SkillWithId extends Skill {
  id: number
}

export interface WorkExperience {
  startAt: Date
  endAt: Date
  id: number
  company: string
  post: string
  startEnd: string
}

export type GetProfileResponse = Response<TeacherProfile>

export type EditProfileRequest = Partial<TeacherProfile> & { id: number }

export type EditProfileResponse = Response<TeacherProfile>

export interface Country {
  id: number
  cn: string
  en: string
  phone_code: string
}

export type GetCountriesResponse = Response<Country[]>
