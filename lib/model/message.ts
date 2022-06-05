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

export type GetMessageStaticsRequest = {
  userId?: number
}
export interface MessageStaticsData {
  sent: { [key in MessageType]: MessageStatics }
  receive: { [key in MessageType]: MessageStatics }
}
export interface MessageStatics {
  total: number
  unread: number
  read: number
}

export type GetMessageStaticsResponse = Response<MessageStaticsData>

export type MessageCount = {
  [key in MessageType]: number
}

//export type MessageHistory = [string, Message[]][]
export type MessageHistory = { [key: string]: Message[] }
