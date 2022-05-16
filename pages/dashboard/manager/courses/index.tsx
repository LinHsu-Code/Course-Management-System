import Head from 'next/head'
import { useState, useEffect } from 'react'
import Layout from '../../../../components/layout'
import { getCourses } from '../../../../lib/request'
import styles from './course.module.scss'
import CourseCard from '../../../../components/course/courseCard'
import { Course, Paginator } from '../../../../lib/model'
import InfiniteScroll from 'react-infinite-scroll-component'
// import { BackTop } from 'antd'

export default function Page() {
  const [paginator, setPaginator] = useState<Paginator>({ page: 1, limit: 20 })
  const [hasMore, setHasMore] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])

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

  useEffect(() => {
    if (paginator.page * paginator.limit > courses.length) {
      fetchCourses(paginator)
    }
  }, [paginator, courses])

  return (
    <Layout>
      <Head>
        <title>{'CMS DashBoard: Manager-Course'}</title>
      </Head>

      {/* <div
        id="scrollableDiv"
        // style={{
        //   overflow: 'auto',
        // }}
      > */}
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
      {/* </div> */}

      {/* <BackTop>
        <div
          style={{
            height: 40,
            width: 40,
            lineHeight: '40px',
            borderRadius: 4,
            backgroundColor: '#1088e9',
            color: '#fff',
            textAlign: 'center',
            fontSize: 14,
          }}
        >
          UP
        </div>
      </BackTop> */}
    </Layout>
  )
}
