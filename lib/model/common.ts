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

export enum Role {
  manager = 'manager',
  teacher = 'teacher',
  student = 'student',
}

export type BadgeStatus =
  | 'processing'
  | 'warning'
  | 'success'
  | 'error'
  | 'default'
  | undefined
