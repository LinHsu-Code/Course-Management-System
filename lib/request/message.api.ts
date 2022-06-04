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
  getInstance('/message', params).then((res) => showMessage(res, false))

const markMessageAsRead = (
  params: MarkMessageAsReadRequest
): Promise<MarkMessageAsReadResponse> =>
  putInstance('/message', params).then((res) => showMessage(res))

const getMessageStatics = (
  params: GetMessageStaticsRequest
): Promise<GetMessageStaticsResponse> =>
  getInstance('/message/statistics', params)

export { getMessages, markMessageAsRead, getMessageStatics }
