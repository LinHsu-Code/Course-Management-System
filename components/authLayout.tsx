import Head from 'next/head'
import Link from 'next/link'
import styles from './auth-layout.module.scss'
import { Layout } from 'antd'
const { Header, Footer, Content } = Layout

export const siteTitle = 'Authenticate'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="a course management website using Next.js"
        />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            siteTitle
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
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
