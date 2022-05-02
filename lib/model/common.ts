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
  path: string[]
  isHideInBreadcrumb?: boolean
  isHideInSiderNav?: boolean
  //hide?: boolean;
  subNav?: DynamicNav[]
}

export type Role = 'manager' | 'teacher' | 'student'
