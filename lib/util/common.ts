import type { RangePickerProps } from 'antd/es/date-picker'
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
