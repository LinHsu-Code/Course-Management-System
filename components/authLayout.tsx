import Link from 'next/link'
import styles from './auth-layout.module.scss'
import { Layout } from 'antd'
const { Header, Footer, Content } = Layout
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.container}>
      <Header>
        {' '}
        <Link href={`/`}>
          <a>Home</a>
        </Link>
        <span> </span>
        <Link href={`/login`}>
          <a>Sign In</a>
        </Link>
        <span> </span>
        <Link href={`/register`}>
          <a>Sign up</a>
        </Link>
      </Header>
      <Content>{children}</Content>
      <Footer className={styles.footer}>Footer</Footer>
    </div>
  )
}
