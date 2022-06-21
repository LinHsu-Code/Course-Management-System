import Head from 'next/head'
import CourseListScrollMode from '../../../../components/course/courseListScrollMode'

export default function Page() {
  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Course List'}</title>
      </Head>

      <CourseListScrollMode />
    </>
  )
}
