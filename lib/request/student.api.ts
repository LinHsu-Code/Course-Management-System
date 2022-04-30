import {
  getInstance,
  postInstance,
  putInstance,
  deleteInstance,
  showMessage,
} from './common'
import { ListStudentRequest } from '../../lib/model'

const getStudents = (params: object) => {
  return getInstance('/students', params).then((res) => showMessage(res, false))
}

const getStudent = (id: string | string[] | undefined) => {
  return getInstance(`/students/${id}`).then((res) => showMessage(res, false))
}

const addStudent = (formValues: ListStudentRequest) => {
  return postInstance('/students', formValues).then((res) => showMessage(res))
}

const editStudent = (formValues: ListStudentRequest) => {
  return putInstance('/students', formValues).then((res) => showMessage(res))
}

const deleteStudent = (id: number) => {
  return deleteInstance('/students', id).then((res) => showMessage(res))
}

export { getStudents, addStudent, deleteStudent, getStudent, editStudent }
