import {
  getInstance,
  postInstance,
  putInstance,
  deleteInstance,
  showMessage,
} from './common'
import {
  GetTeachersRequest,
  GetTeachersResponse,
  AddTeacherRequest,
  AddTeachersResponse,
  EditTeacherRequest,
  EditTeachersResponse,
  DeleteTeacherRequest,
  DeleteTeacherResponse,
  GetTeacherRequest,
  GetTeacherResponse,
} from '../../lib/model'

const getTeachers = (
  params: GetTeachersRequest
): Promise<GetTeachersResponse> => getInstance('/teachers', params)

const addTeacher = (
  formValues: AddTeacherRequest
): Promise<AddTeachersResponse> =>
  postInstance('/teachers', formValues).then((res) => showMessage(res))

const editTeacher = (
  formValues: EditTeacherRequest
): Promise<EditTeachersResponse> =>
  putInstance('/teachers', formValues).then((res) => showMessage(res))

const deleteTeacher = (
  id: DeleteTeacherRequest
): Promise<DeleteTeacherResponse> =>
  deleteInstance('/teachers', id).then((res) => showMessage(res))

const getTeacher = (id: GetTeacherRequest): Promise<GetTeacherResponse> =>
  getInstance(`/teachers/${id}`)

export { getTeachers, addTeacher, deleteTeacher, editTeacher, getTeacher }
