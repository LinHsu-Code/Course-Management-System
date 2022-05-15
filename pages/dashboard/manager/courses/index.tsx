import Head from 'next/head'
import { useState, useEffect } from 'react'
import Layout from '../../../../components/layout'
import { getCourses } from '../../../../lib/request'
import styles from './course.module.scss'
import CourseCard from '../../../../components/course/courseCard'
import { Course } from '../../../../lib/model'

export default function Page() {
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    getCourses({ page: 1, limit: 20 }).then((res) => {
      if (res.data) {
        setCourses(res.data.courses)
      }
    })
  }, [])
  return (
    <Layout>
      <Head>
        <title>{'CMS DashBoard: Manager-Course'}</title>
      </Head>
      <div className={styles.cardContainer}>
        {courses &&
          courses.map((course) => (
            <div key={course.id} className={styles.card}>
              <CourseCard course={course} />
            </div>
          ))}
      </div>
    </Layout>
  )
}
