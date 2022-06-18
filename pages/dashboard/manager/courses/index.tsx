import Head from 'next/head'
import Link from 'next/link'
import { Row, Button } from 'antd'
import { getCourses } from '../../../../lib/request'
import styles from './course.module.scss'
import CourseCard from '../../../../components/course/courseCard'
import { Course, GetCoursesRequest, Courses } from '../../../../lib/model'
import InfiniteScroll from 'react-infinite-scroll-component'
import BackTop from '../../../../components/common/backTop'
import { useUserInfo } from '../../../../hooks/user'
import { useDataListLoad } from '../../../../hooks/dataListLoad'

export default function Page() {
  const {
    setQueryParams,
    hasMore,
    data: courses,
  } = useDataListLoad<GetCoursesRequest, Courses, Course>(getCourses, 'courses')

  const userInfo = useUserInfo()

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Course List'}</title>
      </Head>

      <InfiniteScroll
        dataLength={courses.length}
        next={() => {
          setQueryParams((prev) => ({
            ...prev,
            paginator: { ...prev.paginator, page: prev.paginator.page + 1 },
          }))
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
                      href={`/dashboard/${userInfo.role}/courses/${course.id}`}
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
