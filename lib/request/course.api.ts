import {
  deleteInstance,
  getInstance,
  postInstance,
  putInstance,
  showMessage,
} from './common'
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
  GetCourseScheduleRequest,
  GetCourseScheduleResponse,
  DeleteCourseRequest,
  DeleteCourseResponse,
} from '../../lib/model'

const getCourses = (params: GetCoursesRequest): Promise<GetCoursesResponse> =>
  getInstance('/courses', params)

const getCourse = (params: GetCourseRequest): Promise<GetCourseResponse> =>
  getInstance('/courses/detail', params)

const getCourseTypes = (): Promise<GetCourseTypesResponse> =>
  getInstance('/courses/type')

const generateCourseCode = (): Promise<GenerateCourseCodeResponse> =>
  getInstance('/courses/code')

const addCourse = (formValues: AddCourseRequest): Promise<AddCourseResponse> =>
  postInstance('/courses', formValues).then((res) => showMessage(res))

const updateCourseSchedule = (
  formValues: UpdateCourseScheduleRequest
): Promise<UpdateCourseScheduleResponse> =>
  putInstance('/courses/schedule', formValues).then((res) => showMessage(res))

const updateCourse = (
  formValues: UpdateCourseRequest
): Promise<UpdateCourseResponse> =>
  putInstance('/courses', formValues).then((res) => showMessage(res))

const getCourseSchedule = (
  params: GetCourseScheduleRequest
): Promise<GetCourseScheduleResponse> =>
  getInstance('/courses/schedule', params)

const deleteCourse = (id: DeleteCourseRequest): Promise<DeleteCourseResponse> =>
  deleteInstance('/course', id).then((res) => showMessage(res))

export {
  getCourses,
  getCourse,
  getCourseTypes,
  generateCourseCode,
  addCourse,
  updateCourseSchedule,
  updateCourse,
  getCourseSchedule,
  deleteCourse,
}
