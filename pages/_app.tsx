import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'

type NextPageWithLayout = NextPage & {
  getLayout?: (pageProps: AppProps, page: ReactElement) => ReactNode
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  if (Component.getLayout) {
    return Component.getLayout(pageProps.data, <Component {...pageProps} />)
  } else {
    return <Component {...pageProps} />
  }
}
export default MyApp
// import Head from 'next/head'
// import Link from 'next/link'
// import styles from '../styles/custom-layout.module.scss'
// import type { AppProps } from 'next/app'
// import { Layout } from 'antd'
// import { ReactElement, ReactNode } from 'react'
// const { Header, Footer, Content } = Layout

// //import { ReactNode } from "react";
// import { NextPage } from 'next'

// //export const siteTitle = 'Next.js Sample Website'

// type NextPageWithLayout = NextPage & {
//   getLayout?: (pageProps: AppProps, page: ReactElement) => ReactNode
// }
// type AppPropsWithLayout = AppProps & {
//   Component: NextPageWithLayout
// }

// function MyApp({ Component, pageProps }: AppProps) {
//   return (
//     <>
//       <Head>
//         <title>My site</title>
//       </Head>
//       {/* eslint-disable-next-line react/jsx-props-no-spreading */}
//       {getLayout(<Component {...pageProps} />)}
//     </>
//     // <>
//     //   <Layout className={styles.container}>
//     //     <Head>
//     //       <link rel="icon" href="/favicon.ico" />
//     //       <meta
//     //         name="description"
//     //         content="a course management website using Next.js"
//     //       />
//     //       <meta
//     //         property="og:image"
//     //         content={`https://og-image.vercel.app/${encodeURI(
//     //           siteTitle
//     //         )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
//     //       />
//     //       <meta name="og:title" content={siteTitle} />
//     //       <meta name="twitter:card" content="summary_large_image" />
//     //     </Head>
//     //     <Header>
//     //       {' '}
//     //       <Link href={`/`}>
//     //         <a>Home</a>
//     //       </Link>
//     //       <span> </span>
//     //       <Link href={`/login`}>
//     //         <a>Sign In</a>
//     //       </Link>
//     //       <span> </span>
//     //       <Link href={`/register`}>
//     //         <a>Sign up</a>
//     //       </Link>
//     //     </Header>
//     //     <Content>
//     //       <Component {...pageProps} />
//     //     </Content>
//     //     <Footer className={styles.footer}>Footer</Footer>
//     //   </Layout>
//     // </>
//   )
// }

// export default MyApp
