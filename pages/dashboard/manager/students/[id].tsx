import Head from 'next/head'
import Layout from '../../../../components/layout'
import { useRouter } from 'next/router'
import { getStudent } from '../../../../lib/request'
import { useEffect } from 'react'

export default function StudentDetail() {
  const router = useRouter()
  // const { id } = router.query
  // console.log(id)

  // const fetchStudent = async (id) => {
  //   const res = await getStudent(id)
  //   if (res.data) {
  //     console.log(res.data)
  //     return res.data
  //   }
  // }

  useEffect(() => {
    const { id } = router.query
    console.log(id)
    //   const student = fetchStudent(id)
    //   console.log(student)
  }, [])

  return (
    <Layout>
      <Head>
        <title>{'CMS DashBoard: Manager'}</title>
      </Head>
      {/* <p>student id:{id}</p> */}
    </Layout>
  )
}
