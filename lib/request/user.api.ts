import AES from 'crypto-js/aes'
import { postInstance, showMessage } from './common'
import { LoginRequest, LoginResponse, LogoutResponse } from '../model'

const login = (formValues: LoginRequest): Promise<LoginResponse> => {
  let { role, email, password } = formValues
  password = AES.encrypt(password, 'cms').toString()
  return postInstance('/login', { role, email, password }).then((res) =>
    showMessage(res)
  )
}

const logout = (): Promise<LogoutResponse> => {
  return postInstance('/logout').then((res) => showMessage(res, false))
}

export { login, logout }
