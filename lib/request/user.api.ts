import AES from 'crypto-js/aes'
import { postInstance, getInstance, putInstance, showMessage } from './common'
import {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  GetProfileRequest,
  GetProfileResponse,
  EditProfileRequest,
  EditProfileResponse,
  GetCountriesResponse,
} from '../model'

const login = (formValues: LoginRequest): Promise<LoginResponse> => {
  let { role, email, password } = formValues
  password = AES.encrypt(password, 'cms').toString()
  return postInstance('/login', { role, email, password }).then((res) =>
    showMessage(res)
  )
}

const logout = (): Promise<LogoutResponse> => postInstance('/logout')

const getProfile = (): Promise<GetProfileResponse> => getInstance('/profile')

const editProfile = (
  formValues: EditProfileRequest
): Promise<EditProfileResponse> =>
  putInstance(`/profile/teacher/${formValues.id}`, formValues).then((res) =>
    showMessage(res)
  )

const getCountries = (): Promise<GetCountriesResponse> =>
  getInstance('/countries')

export { login, logout, getProfile, editProfile, getCountries }
