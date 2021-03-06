import Head from 'next/head'
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

export default function Page({ id }: { id: string }) {
  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [info, setInfo] = useState<{ label: string; value: string | number }[]>(
    []
  )

  useEffect(() => {
    getCourse({ id }).then((res) => {
      if (res.data) {
        setCourse(res.data)
        const sales = res.data.sales
        const info = [
          { label: 'Price', value: sales.price || 0 },
          { label: 'Batches', value: sales.batches || 0 },
          { label: 'Students', value: sales.studentAmount || 0 },
          { label: 'Earings', value: sales.earnings || 0 },
        ]
        setInfo(info)
      }
    })
  }, [id])

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Course-Detail'}</title>
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
    </>
  )
}
