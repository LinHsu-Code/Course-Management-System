import {
  getInstance,
  postInstance,
  putInstance,
  deleteInstance,
  showMessage,
} from './common'
import { GetTeachersRequest, GetTeachersResponse } from '../../lib/model'

const getTeachers = (
  params: GetTeachersRequest
): Promise<GetTeachersResponse> => {
  return getInstance('/teachers', params).then((res) => showMessage(res, false))
}

export { getTeachers }
