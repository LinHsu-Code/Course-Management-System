import AES from 'crypto-js/aes'
import { postInstance, showMessage } from './common'

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

export { login, logout }
