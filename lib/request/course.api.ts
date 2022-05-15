import { getInstance, showMessage } from './common'
import { GetCoursesRequest, GetCoursesResponse } from '../../lib/model'

const getCourses = (params: GetCoursesRequest): Promise<GetCoursesResponse> => {
  return getInstance('/courses', params).then((res) => showMessage(res, false))
}

export { getCourses }
