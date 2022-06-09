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
): Promise<GetTeachersResponse> => getInstance('/teachers', params)

export { getTeachers }
