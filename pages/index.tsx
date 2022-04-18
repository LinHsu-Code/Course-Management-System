import Head from 'next/head'
import type { ReactElement } from 'react'
import HomeLayout from '../components/homeLayout'

export default function Home() {
  return (
    <>
      <Head>
        <title>{'Course Management Assistant: Home'}</title>
      </Head>

      <div>Home Page</div>
    </>
  )
}

Home.getLayout = function getLayout(data: any, component: ReactElement) {
  return <HomeLayout>{component}</HomeLayout>
}
