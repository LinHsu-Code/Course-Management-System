import { getInstance, showMessage } from './common'
import { GetMessageRequest, GetMessageResponse } from '../model'

const getMessages = (params: GetMessageRequest): Promise<GetMessageResponse> =>
  getInstance('/message', params).then((res) => showMessage(res, false))

export { getMessages }
