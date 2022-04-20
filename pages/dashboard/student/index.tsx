import Head from 'next/head'
import type { ReactElement } from 'react'
import DashboardLayout from '../../../components/dashboardLayout'

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Manager'}</title>
      </Head>
      <div>Student Overview</div>
    </>
  )
}

Dashboard.getLayout = function getLayout(data: any, component: ReactElement) {
  return <DashboardLayout>{component}</DashboardLayout>
}
