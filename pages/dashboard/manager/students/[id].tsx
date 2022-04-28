import Head from 'next/head'
import Layout from '../../../../components/layout'
import { useRouter } from 'next/router'
import { getStudent } from '../../../../lib/httpRequest'

export default function StudentDetail() {
  const router = useRouter()
  const { id } = router.query
  const student = getStudent(id)
  console.log(student)
  return (
    <Layout>
      <Head>
        <title>{'CMS DashBoard: Manager'}</title>
      </Head>
      <p>student id:{id}</p>
    </Layout>
  )
}
