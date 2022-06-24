import { getInstance, putInstance, postInstance } from './common'
import {
  GetMessageRequest,
  GetMessageResponse,
  MarkMessageAsReadRequest,
  MarkMessageAsReadResponse,
  GetMessageStatisticsResponse,
  PostMessageRequest,
  PostMessageResponse,
} from '../model'

const getMessages = (params: GetMessageRequest): Promise<GetMessageResponse> =>
  getInstance('/message', params)

const markMessageAsRead = (
  params: MarkMessageAsReadRequest
): Promise<MarkMessageAsReadResponse> => putInstance('/message', params)

const getMessageStatistics = (): Promise<GetMessageStatisticsResponse> =>
  getInstance('/message/statistics')

const subscribeMessage = (userId: number): EventSource => {
  return new EventSource(
    `${process.env.BASE_URL}/message/subscribe?userId=${userId}`,
    { withCredentials: true }
  )
}

const postMessage = (
  params: PostMessageRequest
): Promise<PostMessageResponse> => postInstance('/message', params)

export {
  getMessages,
  markMessageAsRead,
  getMessageStatistics,
  subscribeMessage,
  postMessage,
}
