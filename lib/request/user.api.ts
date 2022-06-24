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
  GetDegreesResponse,
} from '../model'

const login = (formValues: LoginRequest): Promise<LoginResponse> => {
  let { role, email, password } = formValues
  password = AES.encrypt(password, 'cms').toString()
  return postInstance('/login', { role, email, password }).then((res) =>
    showMessage(res)
  )
}

const logout = (): Promise<LogoutResponse> => postInstance('/logout')

const getProfile = <T>(): Promise<GetProfileResponse<T>> =>
  getInstance('/profile')

const editProfile = <T>(
  formValues: EditProfileRequest<T>,
  role: string
): Promise<EditProfileResponse<T>> =>
  putInstance(`/profile/${role}/${formValues.id}`, formValues).then((res) =>
    showMessage(res)
  )

const getCountries = (): Promise<GetCountriesResponse> =>
  getInstance('/countries')

const getDegrees = (): Promise<GetDegreesResponse> => getInstance('/degrees')

export { login, logout, getProfile, editProfile, getCountries, getDegrees }
