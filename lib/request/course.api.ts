import { getInstance, postInstance, putInstance, showMessage } from './common'
import {
  GetCoursesRequest,
  GetCoursesResponse,
  GetCourseRequest,
  GetCourseResponse,
  GetCourseTypesResponse,
  GenerateCourseCodeResponse,
  AddCourseRequest,
  AddCourseResponse,
  UpdateCourseScheduleRequest,
  UpdateCourseScheduleResponse,
  UpdateCourseRequest,
  UpdateCourseResponse,
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

const addCourse = (
  formValues: AddCourseRequest
): Promise<AddCourseResponse> => {
  return postInstance('/courses', formValues).then((res) => showMessage(res))
}

const updateCourseSchedule = (
  formValues: UpdateCourseScheduleRequest
): Promise<UpdateCourseScheduleResponse> => {
  return putInstance('/courses/schedule', formValues).then((res) =>
    showMessage(res)
  )
}

const updateCourse = (
  formValues: UpdateCourseRequest
): Promise<UpdateCourseResponse> => {
  return putInstance('/courses', formValues).then((res) => showMessage(res))
}

export {
  getCourses,
  getCourse,
  getCourseTypes,
  generateCourseCode,
  addCourse,
  updateCourseSchedule,
  updateCourse,
}
