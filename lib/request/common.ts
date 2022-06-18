import axios from 'axios'
import { message } from 'antd'
import { isEmpty } from 'lodash'
import { getUserInfo } from '../util'

const userInfo = getUserInfo()

const axiosInstance = axios.create({
  baseURL: process.env.BASE_URL,
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
        Authorization: userInfo.token ? `Bearer ${userInfo.token}` : '',
      },
    }
  }
  return config
})

const getInstance = (url: string, params = {}) => {
  url = !isEmpty(params)
    ? `${url}?${new URLSearchParams(params).toString()}`
    : url

  return axiosInstance
    .get(url)
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
      return {
        msg: err.response.data.msg || err.response.data.message,
        code: err.response.data.code || err.response.data.statusCode,
      }
    } else {
      // Axios was not able to get a response at all. This is a Network-Level Error.
      console.error('[Network Error]: No Response Received At', err)
    }
  } else {
    // Standard JS Error (Syntax, etc...)
    console.error('[Non-HTTP Error]:', err)
  }
}

export { getInstance, postInstance, putInstance, deleteInstance, showMessage }
