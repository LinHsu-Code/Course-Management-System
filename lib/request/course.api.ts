import { getInstance, showMessage } from './common'
import {
  GetCoursesRequest,
  GetCoursesResponse,
  GetCourseRequest,
  GetCourseResponse,
  GetCourseTypesResponse,
  GenerateCourseCodeResponse,
} from '../../lib/model'

const getCourses = (params: GetCoursesRequest): Promise<GetCoursesResponse> => {
  return getInstance('/courses', params).then((res) => showMessage(res, false))
}

const getCourse = (params: GetCourseRequest): Promise<GetCourseResponse> => {
  return getInstance('/courses/detail', params).then((res) =>
    showMessage(res, false)
  )
}

const getCourseTypes = (): Promise<GetCourseTypesResponse> => {
  return getInstance('/courses/type').then((res) => showMessage(res, false))
}

const generateCourseCode = (): Promise<GenerateCourseCodeResponse> => {
  return getInstance('/courses/code').then((res) => showMessage(res, false))
}

export { getCourses, getCourse, getCourseTypes, generateCourseCode }
