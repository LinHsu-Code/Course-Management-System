import '../styles/globals.scss'
import Head from 'next/head'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import DashboardLayout from '../components/layout'
import { MessageCount, Role } from '../lib/model'

export const siteTitle = 'custom-title'

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true)
  const [unReadCount, setUnReadCount] = useState<MessageCount>({
    notification: 0,
    message: 0,
  })
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
      {/message$/.test(path) ? (
        <Component
          {...pageProps}
          unReadCount={unReadCount}
          setUnReadCount={setUnReadCount}
        />
      ) : (
        <Component {...pageProps} />
      )}
    </>
  )

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
    <DashboardLayout unReadCount={unReadCount} setUnReadCount={setUnReadCount}>
      {content}
    </DashboardLayout>
  ) : (
    content
  )
}

export default MyApp
