import { getInstance, showMessage } from './common'
import {
  GetCoursesRequest,
  GetCoursesResponse,
  GetCourseRequest,
  GetCourseResponse,
} from '../../lib/model'

const getCourses = (params: GetCoursesRequest): Promise<GetCoursesResponse> => {
  return getInstance('/courses', params).then((res) => showMessage(res, false))
}

const getCourse = (params: GetCourseRequest): Promise<GetCourseResponse> => {
  return getInstance('/courses/detail', params).then((res) =>
    showMessage(res, false)
  )
}

export { getCourses, getCourse }
