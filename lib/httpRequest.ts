import { baseURL } from './urlConfig'
import axios from 'axios'
import AES from 'crypto-js/aes'
import { message } from 'antd'
import { ListStudentRequest } from '../lib/model'

const axiosInstance = axios.create({
  baseURL,
  responseType: 'json',
})

axiosInstance.interceptors.request.use((config) => {
  if (
    config.url &&
    !config.url.includes('signup') &&
    !config.url.includes('login')
  ) {
    return {
      ...config,
      headers: {
        ...config.headers,
        Authorization: localStorage.getItem('token')
          ? `Bearer ${localStorage.getItem('token')}`
          : '',
      },
    }
  }
  return config
})

const getInstanceByObject = (url: string, params = {}) => {
  url = !!params
    ? `${url}?${Object.entries(params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`
    : url
  return axiosInstance
    .get(url)
    .then((res) => res.data)
    .catch((err) => errorHandler(err))
}

const getInstanceByID = (url: string, id: number) => {
  return axiosInstance
    .get(`${url}/${id}`)
    .then((res) => res.data)
    .catch((err) => errorHandler(err))
}

const postInstance = (url: string, data = {}) => {
  return axiosInstance
    .post(url, data)
    .then((res) => res.data)
    .catch((err) => errorHandler(err))
}

const deleteInstance = (url: string, id: number) => {
  return axiosInstance
    .delete(`${url}/${id}`)
    .then((res) => res.data)
    .catch((err) => errorHandler(err))
}

const putInstance = (url: string, body: object) => {
  return axiosInstance
    .put(url, body)
    .then((res) => res.data)
    .catch((err) => errorHandler(err))
}

const showMessage = (res: any, needShowSuccess = true) => {
  if (res.code >= 400 && res.code < 600) {
    message.error(res.msg)
  } else {
    needShowSuccess && message.success(res.msg)
  }
  return res
}

const errorHandler = (err: any) => {
  if (err.isAxiosError) {
    if (err.response) {
      // Server was able to send us a response, so this is an API Error.
      console.error('[API Error]:', err.response.data)
      return { msg: err.response.data.msg, code: err.response.data.code }
    } else {
      // Axios was not able to get a response at all. This is a Network-Level Error.
      console.error('[Network Error]: No Response Received At', err)
    }
  } else {
    // Standard JS Error (Syntax, etc...)
    console.error('[Non-HTTP Error]:', err)
  }
}

const login = (formValues: any) => {
  let { role, email, password } = formValues
  password = AES.encrypt(password, 'cms').toString()
  return postInstance('/login', { role, email, password }).then((res) =>
    showMessage(res)
  )
}

const logout = () => {
  return postInstance('/logout').then((res) => showMessage(res, false))
}

const getStudentList = (params: object) => {
  return getInstanceByObject('/students', params).then((res) =>
    showMessage(res, false)
  )
}
const getStudent = (id: number) => {
  return getInstanceByID('/students', id).then((res) => showMessage(res, false))
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

export {
  login,
  logout,
  getStudentList,
  addStudent,
  deleteStudent,
  getStudent,
  editStudent,
}
