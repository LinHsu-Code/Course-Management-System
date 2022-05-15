import Head from 'next/head'
import { useEffect } from 'react'
import Layout from '../../../../components/layout'
import { getCourses } from '../../../../lib/request'
import styles from './course.module.scss'

export default function Page() {
  useEffect(() => {
    getCourses({ page: 1, limit: 20 }).then((res) => {
      if (res.data) {
        console.log(res.data)
      }
    })
  }, [])
  return (
    <Layout>
      <Head>
        <title>{'CMS DashBoard: Manager-Course'}</title>
      </Head>
      <div className={styles.cardContainer}>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
        <div className={styles.card}></div>
      </div>
    </Layout>
  )
}
