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

export interface StudentProfile {
  createdAt: Date
  updatedAt: Date
  id: number
  email: string
  address: string[]
  age: number
  country: string
  avatar: string
  description: string
  education: string
  gender: number
  memberEndAt: Date
  memberStartAt: Date
  name: string
  phone: string
  interest: string[]
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

export type GetProfileResponse<T> = Response<T>

export type EditProfileRequest<T> = Partial<T> & { id: number }

export type EditProfileResponse<T> = Response<T>

export interface Country {
  id: number
  cn: string
  en: string
  phone_code: string
}

export type GetCountriesResponse = Response<Country[]>

export interface Degree {
  id: number
  short: string
  name: string
  group: string
}

export type GetDegreesResponse = Response<Degree[]>
