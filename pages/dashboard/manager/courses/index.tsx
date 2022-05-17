import Head from 'next/head'
import { useState, useEffect } from 'react'
import Layout from '../../../../components/layout'
import { getCourses } from '../../../../lib/request'
import styles from './course.module.scss'
import CourseCard from '../../../../components/course/courseCard'
import { Course, Paginator } from '../../../../lib/model'
import InfiniteScroll from 'react-infinite-scroll-component'
import { VerticalAlignTopOutlined } from '@ant-design/icons'
import { BackTop } from 'antd'

export default function Page() {
  const [paginator, setPaginator] = useState<Paginator>({ page: 1, limit: 20 })
  const [hasMore, setHasMore] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    const fetchCourses = (paginator: { page: number; limit: number }) => {
      getCourses(paginator).then((res) => {
        if (res.data) {
          setCourses([...courses, ...res.data.courses])
          if (res.data.total <= paginator.page * paginator.limit) {
            setHasMore(false)
          }
        }
      })
    }
    if (paginator.page * paginator.limit > courses.length) {
      fetchCourses(paginator)
    }
  }, [paginator, courses])

  return (
    <Layout>
      <Head>
        <title>{'CMS DashBoard: Manager-Course'}</title>
      </Head>

      <InfiniteScroll
        dataLength={courses.length}
        next={() => setPaginator({ ...paginator, page: ++paginator.page })}
        hasMore={hasMore}
        scrollableTarget="scrollableDiv"
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className={styles.cardContainer}>
          {courses &&
            courses.map((course) => (
              <div key={course.id} className={styles.card}>
                <CourseCard course={course} />
              </div>
            ))}
        </div>
      </InfiniteScroll>

      <BackTop
        target={() => document.getElementById('scrollableDiv') || window}
        visibilityHeight={800}
        className={styles.backTop}
      >
        <div className={styles.backTopContent}>
          <VerticalAlignTopOutlined className={styles.backTopIcon} />
        </div>
      </BackTop>
    </Layout>
  )
}
