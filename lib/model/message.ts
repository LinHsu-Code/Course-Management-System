import { Response, Paginator, Role } from './common'

export type MessageType = 'notification' | 'message'

export type MessageStatus = 0 | 1

export interface From {
  id: number
  role: Role
  nickname: string
}

export interface Message {
  createdAt: Date
  id: number
  content: string
  status: MessageStatus
  type: MessageType
  from: From
}

export interface GetMessageRequest {
  status?: number
  userId?: number
  limit?: number
  page?: number
  type?: MessageType
}

export interface GetMessageResponseData {
  total: number
  messages: Message[]
  paginator: Paginator
}

export type GetMessageResponse = Response<GetMessageResponseData>
export interface MarkMessageAsReadRequest {
  ids: number[]
  status: 1
}

export type MarkMessageAsReadResponse = Response<boolean>

export interface MessageStatisticsData {
  sent: { [key in MessageType]: MessageStatistics }
  receive: { [key in MessageType]: MessageStatistics }
}
export interface MessageStatistics {
  total: number
  unread: number
  read: number
}

export type GetMessageStatisticsResponse = Response<MessageStatisticsData>

export type MessageCount = {
  [key in MessageType]: number
}

export type MessageHistory = { [key: string]: Message[] }

export interface PostMessageRequest {
  from: number
  to: number
  content: string
  alertAt: string
}

export interface PostMessageData extends PostMessageRequest {
  status: number
  type: string
  createdAt: Date
  updatedAt: Date
  id: number
}

export type PostMessageResponse = Response<PostMessageData>
