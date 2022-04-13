import { baseURL } from './urlConfig'
import axios from 'axios'
import { AES } from 'crypto-js'

const axiosInstance = axios.create({
  baseURL,
  timeout: 1000,
  responseType: 'json',
})

const login = async (formValues) => {
  const { role, email, password } = formValues
  const hashedPassword = AES.encrypt(password, 'cms').toString()

  const loginObject = {
    role,
    email,
    password: hashedPassword,
  }

  try {
    const { data } = await axiosInstance.post('/login', loginObject)
    //console.log(data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      //handleAxiosError(error)
      //console.log(error)
      console.log(error.response.data)
    } else {
      console.log(123, error)
      //handleUnexpectedError(error)
    }
  }
}

export { login }
