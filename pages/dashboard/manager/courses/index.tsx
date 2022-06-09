import Head from 'next/head'
import Link from 'next/link'
import { Row, Button } from 'antd'
import { useState, useEffect } from 'react'
import { getCourses } from '../../../../lib/request'
import styles from './course.module.scss'
import CourseCard from '../../../../components/course/courseCard'
import { Course, Paginator } from '../../../../lib/model'
import InfiniteScroll from 'react-infinite-scroll-component'
import BackTop from '../../../../components/common/backTop'

export default function Page() {
  const [paginator, setPaginator] = useState<Paginator>({ page: 1, limit: 20 })
  const [hasMore, setHasMore] = useState(true)
  const [courses, setCourses] = useState<Course[]>([])

  const AppendCourses = (paginator: Paginator) => {
    getCourses(paginator).then((res) => {
      if (res.data) {
        setCourses((pre) => [...pre, ...res.data.courses])
        if (res.data.total <= paginator.page * paginator.limit) {
          setHasMore(false)
        }
      }
    })
  }

  useEffect(() => {
    getCourses({ page: 1, limit: 20 }).then((res) => {
      if (res.data) {
        setCourses(res.data.courses)
        if (res.data.total <= 20) {
          setHasMore(false)
        }
      }
    })
  }, [])

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Manager-Course List'}</title>
      </Head>

      <InfiniteScroll
        dataLength={courses.length}
        next={() => {
          AppendCourses({ ...paginator, page: paginator.page + 1 })
          setPaginator({ ...paginator, page: paginator.page + 1 })
        }}
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
                <CourseCard course={course}>
                  <Row>
                    <Link
                      href={`/dashboard/manager/courses/${course.id}`}
                      passHref
                    >
                      <Button type="primary">Read More</Button>
                    </Link>
                  </Row>
                </CourseCard>
              </div>
            ))}
        </div>
      </InfiniteScroll>

      <BackTop targetId="scrollableDiv" visibilityHeight={800} />
    </>
  )
}
