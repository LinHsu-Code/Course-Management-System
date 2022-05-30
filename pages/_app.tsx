import '../styles/globals.scss'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import DashboardLayout from '../components/layout'
import { Role } from '../lib/model'

export const siteTitle = 'custom-title'

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const path = router.pathname
  const content = (
    <>
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
      <Component {...pageProps} />
    </>
  )

  useEffect(() => {
    const path = router.pathname
    const role = localStorage.getItem('role') as Role
    const token = localStorage.getItem('token')
    if (/dashboard/.test(path)) {
      !token && router.replace('/login', undefined, { shallow: true }) //!token or !checkedToken api
      const regex = new RegExp(`/dashboard$ | dashboard\/$/`, 'g')
      role &&
        regex.test(path) &&
        router.replace(`/dashboard/${role}`, undefined, { shallow: true })
      role && router.replace(path, undefined, { shallow: true })
    } else if (/login/.test(path)) {
      role && router.replace(`/dashboard/${role}`, undefined, { shallow: true }) //role and checkedToken api
    }
  }, [router])

  return /dashboard/.test(path) ? (
    <DashboardLayout>{content}</DashboardLayout>
  ) : (
    content
  )
}

export default MyApp
