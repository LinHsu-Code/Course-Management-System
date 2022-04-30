export interface Response<T> {
  data: T
  msg: string
  code: number
}

export interface Paginator {
  page: number
  limit: number
}
