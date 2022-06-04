import { getInstance, putInstance, showMessage } from './common'
import {
  GetMessageRequest,
  GetMessageResponse,
  MarkMessageAsReadRequest,
  MarkMessageAsReadResponse,
  GetMessageStaticsRequest,
  GetMessageStaticsResponse,
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

const subscribeMessage = (): EventSource => {
  const userId = Number(localStorage.getItem('userId'))
  return new EventSource(
    `${process.env.BASE_URL}/message/subscribe?userId=${userId}`,
    { withCredentials: true }
  )
}

export { getMessages, markMessageAsRead, getMessageStatics, subscribeMessage }
