import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'

type NextPageWithLayout = NextPage & {
  getLayout?: (pageProps: AppProps, page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

import Head from 'next/head'
export const siteTitle = 'custom-title'

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // if (Component.getLayout) {
  //   return Component.getLayout(pageProps.data, <Component {...pageProps} />)
  // } else {
  //   return <Component {...pageProps} />
  // }

  return (
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
      {Component.getLayout ? (
        Component.getLayout(pageProps.data, <Component {...pageProps} />)
      ) : (
        <Component {...pageProps} />
      )}
    </>
  )
}

export default MyApp
