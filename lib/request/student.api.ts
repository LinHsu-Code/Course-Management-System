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
): Promise<GetStudentsResponse> => getInstance('/students', params)

const addStudent = (
  formValues: AddStudentRequest
): Promise<AddStudentsResponse> =>
  postInstance('/students', formValues).then((res) => showMessage(res))

const editStudent = (
  formValues: EditStudentRequest
): Promise<EditStudentsResponse> =>
  putInstance('/students', formValues).then((res) => showMessage(res))

const deleteStudent = (
  id: DeleteStudentRequest
): Promise<DeleteStudentResponse> =>
  deleteInstance('/students', id).then((res) => showMessage(res))

const getStudent = (id: GetStudentRequest): Promise<GetStudentResponse> =>
  getInstance(`/students/${id}`)

export { getStudents, addStudent, deleteStudent, editStudent, getStudent }
