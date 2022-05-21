import Head from 'next/head'
import Layout from '../../../../components/layout'
import { getCourse } from '../../../../lib/request'
import { GetServerSideProps } from 'next/types'
import CourseCard from '../../../../components/course/courseCard'
import CourseDetailCard from '../../../../components/course/courseDetailCard'
import { useState, useEffect } from 'react'
import { Row, Col } from 'antd'
import { CourseDetail } from '../../../../lib/model'

import styles from './detail.module.scss'

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id as string
  return {
    props: { id },
  }
}

// const getServerSideProps: GetServerSideProps = async (context) => {
//   const id = context.query.id as string
//   return {
//     props: { id },
//   }
// }

export default function Page(props: { id: string }) {
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [info, setInfo] = useState<{ label: string; value: string | number }[]>(
    []
  )

  useEffect(() => {
    getCourse({ id: props.id }).then((res) => {
      if (res.data) {
        setCourse(res.data)
        console.log(res.data)
        const sales = res.data.sales
        const info = [
          { label: 'Price', value: sales.price },
          { label: 'Batches', value: sales.batches },
          { label: 'Students', value: sales.studentAmount },
          { label: 'Earings', value: sales.earnings },
        ]
        setInfo(info)
      }
    })
  }, [])

  return (
    <Layout>
      <Head>
        <title>{'CMS DashBoard: Manager-Course-Detail'}</title>
      </Head>

      <Row gutter={[6, 16]} wrap={false}>
        <Col flex="1 250px">
          {course && (
            <CourseCard course={course}>
              <Row className={styles.salesContainer}>
                {info.map((item, index) => (
                  <Col className={styles.salesItem} span="6" key={index}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </Col>
                ))}
              </Row>
            </CourseCard>
          )}
        </Col>
        <Col flex="2 2 300px">
          {course && <CourseDetailCard course={course} />}
        </Col>
      </Row>
    </Layout>
  )
}
