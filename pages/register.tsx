import type { NextPage } from 'next'
import Head from 'next/head'
import Layout from '../components/layout'

const Page: NextPage = () => {
  return (
    <Layout layoutType="auth">
      <Head>
        <title>{'Course Management Assistant: Register'}</title>
      </Head>
      <section>register</section>
    </Layout>
  )
}

export default Page
