import '../styles/globals.scss'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import DashboardLayout from '../components/layout'
import { Role } from '../lib/model'

export const siteTitle = 'custom-title'

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true)
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

  // useEffect(() => {
  //   ;(async () => {
  //     const path = router.pathname
  //     const role = localStorage.getItem('role') as Role
  //     const token = localStorage.getItem('token')
  //     if (/dashboard/.test(path)) {
  //       !token && (await router.replace('/login', undefined, { shallow: true })) //!token or !checkedToken api
  //       console.log('ddddddd')
  //       role &&
  //         /dashboard$/.test(path) &&
  //         (await router.replace(`/dashboard/${role}`, undefined, {
  //           shallow: true,
  //         }))
  //     } else if (/login/.test(path)) {
  //       role &&
  //         token &&
  //         (await router.replace(`/dashboard/${role}`, undefined, {
  //           shallow: true,
  //         })) //role and checkedToken api
  //     }
  //     setLoading(false)
  //   })()
  // }, [router])

  useEffect(() => {
    ;(async () => {
      const path = router.pathname
      const role = localStorage.getItem('role') as Role
      const token = localStorage.getItem('token')
      let flag = true
      if (/dashboard/.test(path)) {
        if (!token) {
          flag = false
          await router.replace('/login', undefined, { shallow: true }) //!token or !checkedToken api
        } else if (role && /dashboard$/.test(path)) {
          console.log('ddddddd')
          flag = false
          await router.replace(`/dashboard/${role}`, undefined, {
            shallow: true,
          })
        }
      } else if (/login/.test(path) && role && token) {
        flag = false
        await router.replace(`/dashboard/${role}`, undefined, {
          shallow: true,
        }) //role and checkedToken api
      }
      flag && setLoading(false)
    })()
  }, [router])

  return loading ? (
    <div>loading...</div>
  ) : /dashboard/.test(path) ? (
    <DashboardLayout>{content}</DashboardLayout>
  ) : (
    content
  )
}

export default MyApp
