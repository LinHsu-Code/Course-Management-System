import Head from 'next/head'
import { useState } from 'react'
import { Input, Button, Row, Col } from 'antd'
import { getTeachers } from '../../../../lib/request'
import { PlusOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'
import TeacherModal from '../../../../components/teachers/teacherModal'
import TeacherTable from '../../../../components/teachers/teacherTable'
import { GetTeachersRequest, Teacher, Teachers } from '../../../../lib/model'
import { useDataListLoad } from '../../../../hooks/dataListLoad'

export default function Page() {
  const { data, queryParams, setQueryParams, total, setData } = useDataListLoad<
    GetTeachersRequest,
    Teachers,
    Teacher
  >(getTeachers, 'teachers', false)

  const [editContent, setEditContent] = useState<Teacher | null>(null)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleAdd = () => {
    setEditContent(null)
    setIsModalVisible(true)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQueryParams({
      paginator: { page: 1, limit: 20 },
      queries: { query: e.target.value },
    })
  }

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Teacher List'}</title>
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

        <TeacherTable
          data={data}
          setData={setData}
          total={total}
          queryParams={queryParams}
          setQueryParams={setQueryParams}
          setEditContent={setEditContent}
          setIsModalVisible={setIsModalVisible}
        />

        {isModalVisible && (
          <TeacherModal
            editContent={editContent}
            setData={setData}
            setIsModalVisible={setIsModalVisible}
          />
        )}
      </div>
    </>
  )
}
