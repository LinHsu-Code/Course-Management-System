import { Response } from './common'
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
