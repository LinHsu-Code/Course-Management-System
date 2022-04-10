import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import CustomLayout, { siteTitle } from '../components/customLayout'
//import styles from '../styles/Home.module.css'

const Register: NextPage = () => {
  return (
    <CustomLayout>
      <Head>
        <title>{'Register'}</title>
      </Head>
      <section>register</section>
    </CustomLayout>
  )
}

export default Register
