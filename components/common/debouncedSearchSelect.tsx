import { Select, Spin, SelectProps } from 'antd'
import debounce from 'lodash/debounce'
import React from 'react'

export interface DebounceSelectProps<OptionValue = any>
  extends Omit<SelectProps<OptionValue>, 'options' | 'children'> {
  fetchOptions: (search: string) => Promise<OptionValue[]>
  debounceTimeout?: number
}

export default function DebouncedSearchSelect<
  OptionValue extends {
    key?: string
    label: React.ReactNode
    value: string | number
  } = any
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps) {
  const [fetching, setFetching] = React.useState(false)
  const [options, setOptions] = React.useState<OptionValue[]>([])
  const fetchRef = React.useRef(0)
  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1
      const fetchId = fetchRef.current
      setOptions([])
      setFetching(true)
      value &&
        fetchOptions(value).then((newOptions) => {
          if (fetchId !== fetchRef.current) {
            // for fetch callback order
            return
          }
          setOptions(newOptions)
          setFetching(false)
        })
    }

    return debounce(loadOptions, debounceTimeout)
  }, [fetchOptions, debounceTimeout])

  return (
    <Select
      showSearch
      //labelInValue
      filterOption={false}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  )
}
