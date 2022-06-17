import { getInstance, putInstance, postInstance, showMessage } from './common'
import {
  GetMessageRequest,
  GetMessageResponse,
  MarkMessageAsReadRequest,
  MarkMessageAsReadResponse,
  GetMessageStaticsRequest,
  GetMessageStaticsResponse,
  PostMessageRequest,
  PostMessageResponse,
} from '../model'

const getMessages = (params: GetMessageRequest): Promise<GetMessageResponse> =>
  getInstance('/message', params)

const markMessageAsRead = (
  params: MarkMessageAsReadRequest
): Promise<MarkMessageAsReadResponse> => putInstance('/message', params)

const getMessageStatics = (
  params: GetMessageStaticsRequest
): Promise<GetMessageStaticsResponse> =>
  getInstance('/message/statistics', params)

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
  getMessageStatics,
  subscribeMessage,
  postMessage,
}
