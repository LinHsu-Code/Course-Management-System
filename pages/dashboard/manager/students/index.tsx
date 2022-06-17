import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Input, Button, Row, Col } from 'antd'
import { getStudents } from '../../../../lib/request'
import { PlusOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'
import StudentModal from '../../../../components/student/studentModal'
import StudentTable from '../../../../components/student/studentTable'
import { GetStudentsRequest, Student, Students } from '../../../../lib/model'
import { useDataListLoad } from '../../../../hooks/dataListLoad'

export default function Page() {
  // const [queryParams, setQueryParams] = useState({
  //   paginator: { page: 1, limit: 20 },
  //   queryName: '',
  // })
  // const [total, setTotal] = useState(0)
  // const [data, setData] = useState<Student[]>([])

  const [query, setQuery] = useState<string>('')

  const { data, queryParams, setQueryParams, total, setTotal, setData } =
    useDataListLoad<GetStudentsRequest, Students, Student>(
      getStudents,
      'students',
      false
      // { query }
    )

  const [editContent, setEditContent] = useState({})
  const [isModalVisible, setIsModalVisible] = useState(false)

  // useEffect(() => {
  //   fetchStudents(queryParams)
  // }, [queryParams])

  // const fetchStudents = (queryParams: {
  //   paginator: { page: number; limit: number }
  //   queryName: string
  // }) => {
  //   const params = queryParams.queryName
  //     ? { ...queryParams.paginator, query: queryParams.queryName }
  //     : { ...queryParams.paginator }
  //   getStudents(params).then((res) => {
  //     if (res.data) {
  //       setTotal(res.data.total)
  //       setData(res.data.students)
  //     }
  //   })
  // }

  const handleAdd = () => {
    setEditContent({})
    setIsModalVisible(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams({
      paginator: { page: 1, limit: 20 },
      queries: { query: e.target.value },
    })
    //setQuery(e.target.value)
  }

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Student List'}</title>
      </Head>
      <div style={{ overflowX: 'auto' }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: 16 }}>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleAdd()}
            >
              Add
            </Button>
          </Col>

          <Col>
            <Input.Search
              placeholder="Search by name"
              onChange={debounce((e) => {
                handleSearch(e)
              }, 1000)}
            />
          </Col>
        </Row>

        <StudentTable
          data={data}
          setData={setData}
          total={total}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          setEditContent={setEditContent}
          setIsModalVisible={setIsModalVisible}
        />

        {isModalVisible && (
          <StudentModal
            editContent={editContent}
            setData={setData}
            setIsModalVisible={setIsModalVisible}
          />
        )}
      </div>
    </>
  )
}
