import Head from 'next/head'
import type { ReactElement } from 'react'
import Layout from '../components/layout'

export default function Home() {
  return (
    <Layout layoutType="home">
      <Head>
        <title>{'Course Management Assistant: Home'}</title>
      </Head>

      <div>Home Page</div>
    </Layout>
  )
}
