import Head from 'next/head'
import { useState, useEffect } from 'react'
import { Input, Button, Row, Col } from 'antd'
import Layout from '../../../../components/layout'
import { getStudents } from '../../../../lib/request'
import { PlusOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'
import StudentModal from '../../../../components/student/studentModal'
import StudentList from '../../../../components/student/studentList'

export default function Dashboard() {
  const [queryParams, setQueryParams] = useState({
    paginator: { page: 1, limit: 20 },
    queryName: '',
  })
  const [total, setTotal] = useState(0)
  const [data, setData] = useState([])
  const [editContent, setEditContent] = useState({})
  const [isModalVisible, setIsModalVisible] = useState(false)

  useEffect(() => {
    fetchStudentList(queryParams)
  }, [queryParams])

  const fetchStudentList = (queryParams: {
    paginator: { page: number; limit: number }
    queryName: string
  }) => {
    const params = queryParams.queryName
      ? { ...queryParams.paginator, query: queryParams.queryName }
      : { ...queryParams.paginator }
    getStudents(params).then((res) => {
      if (res.data) {
        setTotal(res.data.total)
        setData(res.data.students)
      }
    })
  }

  const handleAdd = () => {
    setEditContent({})
    setIsModalVisible(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams({
      paginator: { page: 1, limit: 20 },
      queryName: e.target.value,
    })
  }

  return (
    <Layout>
      <Head>
        <title>{'CMS DashBoard: Manager'}</title>
      </Head>
      <div>
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

        <StudentList
          data={data}
          total={total}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          setEditContent={setEditContent}
          setIsModalVisible={setIsModalVisible}
          fetchStudentList={fetchStudentList}
        />

        {isModalVisible && (
          <StudentModal
            setIsModalVisible={setIsModalVisible}
            editContent={editContent}
            queryParams={queryParams}
            fetchStudentList={fetchStudentList}
          />
        )}
      </div>
    </Layout>
  )
}
