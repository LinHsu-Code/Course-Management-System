import { message } from 'antd'
import type { RangePickerProps } from 'antd/es/date-picker'
import { RcFile } from 'antd/lib/upload'
import moment from 'moment'

export const toPascalCase = (string: string) => {
  return string.replace(/\w+/g, function (w) {
    return w[0].toUpperCase() + w.slice(1).toLowerCase()
  })
}

export const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  return current && current < moment().endOf('day')
}

export const getUserInfo = () => {
  if (typeof window !== 'undefined') {
    const userId = Number(localStorage.getItem('userId'))
    const role = localStorage.getItem('role')
    const token = localStorage.getItem('token')
    return { userId, role, token }
  }
  return {}
}

export function beforeUploadAvatar(file: File) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'

  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

export const getBase64 = (file: RcFile): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
