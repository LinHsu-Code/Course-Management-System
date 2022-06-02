import { Response, Paginator, Role } from './common'

export type Type = 'notification' | 'message'

export type Status = 0 | 1

export interface From {
  id: number
  role: Role
  nickname: string
}

export interface Message {
  createdAt: Date
  id: number
  content: string
  status: Status
  type: Type
  from: From
}

export interface GetMessageRequest {
  status?: number
  userId?: number
  limit?: number
  page?: number
  type?: Type
}

export interface GetMessageResponseData {
  total: number
  messages: Message[]
  paginator: Paginator
}

export type GetMessageResponse = Response<GetMessageResponseData>
