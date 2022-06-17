import { omitBy } from 'lodash'
import { useCallback, useEffect, useState } from 'react'
import { Response } from '../lib/model'

export interface ListResponse {
  total: number
}

export function useDataListLoad<I, D extends ListResponse, K>(
  requestApi: (params: I) => Promise<Response<D>>,
  sourceKey: keyof D,
  isAppend = true
) {
  const [data, setData] = useState<K[]>([])

  const [queryParams, setQueryParams] = useState({
    paginator: { page: 1, limit: 20 },
    queries: {},
  })
  const [hasMore, setHasMore] = useState<boolean>(true)

  const [total, setTotal] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)

  const api = useCallback(requestApi, [requestApi])

  useEffect(() => {
    const params = omitBy(
      { ...queryParams.paginator, ...queryParams.queries },
      (item) => !item
    ) as any

    api(params).then((res) => {
      if (res.data) {
        const newData = res.data[sourceKey] as unknown as K[]

        isAppend ? setData((pre) => [...pre, ...newData]) : setData(newData)
        setTotal(res.data.total)

        if (
          res.data.total <=
          queryParams.paginator.page * queryParams.paginator.limit
        ) {
          setHasMore(false)
        }
      }
    })
  }, [queryParams, isAppend, sourceKey, api])

  return {
    data,
    hasMore,
    queryParams,
    total,
    loading,
    setQueryParams,
    setData,
    setTotal,
    setLoading,
  }
}
