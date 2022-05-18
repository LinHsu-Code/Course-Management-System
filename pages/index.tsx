import Head from 'next/head'
import { Layout } from 'antd'
import styles from '../styles/home.module.scss'
const { Header, Footer, Content } = Layout

export default function Page() {
  return (
    <Layout className={styles.container}>
      <Head>
        <title>{'Course Management Assistant: Home'}</title>
      </Head>

      <Header className={styles.header}>Home Header</Header>
      <Content className={styles.main}>
        <div>Home Page</div>
      </Content>
      <Footer className={styles.footer}>Home Footer</Footer>
    </Layout>
  )
}
