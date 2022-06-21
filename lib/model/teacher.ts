import { Response, Paginator } from './common'
// export interface CourseTeacher {
//   createdAt: Date
//   updatedAt: Date
//   id: number
//   country: string
//   courseAmount: number
//   email: string
//   name: string
//   phone: string
//   profileId: number
// }

export type CourseTeacher = Omit<Teacher, 'skills'>

export interface Teacher {
  name: string
  email: string
  country: string
  phone: string
  profileId: number
  createdAt: Date
  updatedAt: Date
  id: number
  courseAmount: number
  skills: Skill[]
}
// export interface Teacher extends CourseTeacher {
//   skills: Skill[]
// }
export interface TeacherWithProfile extends Teacher {
  profile: Profile
}

export interface Profile {
  createdAt: Date
  updatedAt: Date
  id: number
  address: string[]
  gender: number
  birthday: Date
  avatar: string
  description: string
}

export interface Skill {
  name: string
  level: number
}

export interface GetTeachersRequest {
  query?: string
  page?: number
  limit?: number
}

export interface Teachers {
  total: number
  teachers: Teacher[]
  paginator: Paginator
}

export type GetTeachersResponse = Response<Teachers>

export interface AddTeacherRequest {
  name: string
  email: string
  country: string
  prefix: string
  phone: string
  skills: Skill[]
}

export type AddTeachersResponse = Response<Teacher>

export interface EditTeacherRequest extends AddTeacherRequest {
  id: number
}
export type EditTeachersResponse = Response<TeacherWithProfile>

export type DeleteTeacherRequest = number

export type DeleteTeacherResponse = Response<boolean>

// export type GetTeacherRequest = string
export type GetTeacherRequest = number

export type GetTeacherResponse = Response<TeacherWithProfile>
