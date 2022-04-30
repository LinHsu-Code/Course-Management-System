import {
  getInstance,
  postInstance,
  putInstance,
  deleteInstance,
  showMessage,
} from './common'
import {
  GetStudentsRequest,
  GetStudentsResponse,
  AddStudentRequest,
  AddStudentsResponse,
  EditStudentRequest,
  EditStudentsResponse,
  DeleteStudentRequest,
  DeleteStudentResponse,
  GetStudentRequest,
  GetStudentResponse,
} from '../../lib/model'

const getStudents = (
  params: GetStudentsRequest
): Promise<GetStudentsResponse> => {
  return getInstance('/students', params).then((res) => showMessage(res, false))
}

const addStudent = (
  formValues: AddStudentRequest
): Promise<AddStudentsResponse> => {
  return postInstance('/students', formValues).then((res) => showMessage(res))
}

const editStudent = (
  formValues: EditStudentRequest
): Promise<EditStudentsResponse> => {
  return putInstance('/students', formValues).then((res) => showMessage(res))
}

const deleteStudent = (
  id: DeleteStudentRequest
): Promise<DeleteStudentResponse> => {
  return deleteInstance('/students', id).then((res) => showMessage(res))
}

const getStudent = (id: GetStudentRequest): Promise<GetStudentResponse> => {
  return getInstance(`/students/${id}`).then((res) => showMessage(res, false))
}
export { getStudents, addStudent, deleteStudent, editStudent, getStudent }
