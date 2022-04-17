import type { NextPage } from 'next'
import Head from 'next/head'
import type { ReactElement } from 'react'
import DashboardLayout from '../../components/dashboardLayout'

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>{'Course Management Assistant: Sign In'}</title>
      </Head>
      <div>content</div>
    </>
  )
}

Dashboard.getLayout = function getLayout(data: any, component: ReactElement) {
  return <DashboardLayout>{component}</DashboardLayout>
}
