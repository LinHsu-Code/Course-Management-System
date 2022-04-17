import { baseURL } from './urlConfig'
import axios from 'axios'
import AES from 'crypto-js/aes'
import { message } from 'antd'

const showMessage = (code: Number, msg: String) => {
  if (code >= 400 && code < 600) {
    message.error(msg)
  } else {
    message.success(msg)
  }
}

const axiosInstance = axios.create({
  baseURL,
  timeout: 1000,
  responseType: 'json',
})

axiosInstance.interceptors.request.use((config) => {
  if (
    config.url &&
    (config.url.includes('dashboard') || config.url.includes('logout'))
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

const login = async (formValues: any) => {
  const { role, email, password } = formValues
  const hashedPassword = AES.encrypt(password, 'cms').toString()

  const loginObject = {
    role,
    email,
    password: hashedPassword,
  }

  try {
    const { data } = await axiosInstance.post('/login', loginObject)
    showMessage(data.code, data.msg)
    return data.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        showMessage(error.response.data.code, error.response.data.msg)
      }
    } else {
      console.log(error)
    }
  }
}

const logout = async () => {
  try {
    await axiosInstance.post('/logout')
    localStorage.clear()
  } catch (error) {
    console.log(error)
  }
}

export { login, logout }
