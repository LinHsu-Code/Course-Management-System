import type { NextPage } from 'next'
import Head from 'next/head'
import { Layout } from 'antd'
const { Header, Content, Footer } = Layout

const Page: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>{'Course Management Assistant: Register'}</title>
      </Head>
      <Header>Header</Header>
      <Content>register</Content>
      <Footer>Footer</Footer>
    </Layout>
  )
}

export default Page
