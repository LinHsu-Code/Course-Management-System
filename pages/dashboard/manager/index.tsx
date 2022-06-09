import Head from 'next/head'
import { useEffect } from 'react'
import { getOverview } from '../../../lib/request/statistics'

export default function Page() {
  useEffect(() => {
    getOverview().then((res) => {
      if (res) {
        console.log(res)
      }
    })
  }, [])

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Manager'}</title>
      </Head>
      <div>Manager Overview</div>
    </>
  )
}
