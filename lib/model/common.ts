export interface Response<T> {
  data: T
  msg: string
  code: number
}

export interface Paginator {
  page: number
  limit: number
}

export interface DynamicNav {
  icon?: JSX.Element
  label: string
  path: string
  isHideInSiderNav?: boolean
  isNotPage?: boolean
  subNav?: [DynamicNav, ...DynamicNav[]]
}

export type Role = 'manager' | 'teacher' | 'student'

export type BadgeStatus =
  | 'processing'
  | 'warning'
  | 'success'
  | 'error'
  | 'default'
  | undefined

export interface OptionValue {
  label: string
  value: number
}

export type Entries<T> = {
  [K in keyof T]: [K, T[K]]
}[keyof T][]
