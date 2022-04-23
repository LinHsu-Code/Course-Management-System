import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Table, Space, Input, Button, Row, Col, Popconfirm } from 'antd'
import Layout from '../../../../components/layout'
import { getStudentList } from '../../../../lib/httpRequest'
import { formatDistanceToNow } from 'date-fns'
import { PlusOutlined } from '@ant-design/icons'
import { debounce } from 'lodash'
import { ListStudent, CourseType, StudentType } from '../../../../lib/model'
import { ColumnType } from 'antd/lib/table'
import StudentModal from '../../../../components/student/studentModal'
import { deleteStudent } from '../../../../lib/httpRequest'

export default function Dashboard() {
  const [paginator, setPaginator] = useState({ page: 1, limit: 20 })
  const [total, setTotal] = useState(0)
  const [data, setData] = useState([])
  const [queryName, setQueryName] = useState('')
  const [isEdit, setIsEdit] = useState(false)
  const [editContent, setEditContent] = useState({})
  const [isEditSuccess, setIsEditSuccess] = useState(false)

  const [isModalVisible, setIsModalVisible] = useState(false)

  const handleEdit = async (record: ListStudent) => {
    setIsEdit(true)
    setEditContent({
      name: record.name,
      email: record.email,
      country: record.country,
      type: record.type?.id,
      id: record.id,
    })
    setIsModalVisible(true)
  }

  const handleDeleteConfirm = async (id: number) => {
    const res = await deleteStudent(id)
    if (res.data) {
      getStudentList({ ...paginator, query: queryName }).then((res) => {
        if (res.data) {
          setTotal(res.data.total)
          setData(res.data.students)
        }
      })
    }
  }

  useEffect(() => {
    getStudentList({ ...paginator, query: queryName }).then((res) => {
      if (res.data) {
        setTotal(res.data.total)
        setData(res.data.students)
      }
    })
    isEditSuccess && setIsEditSuccess(false)
  }, [paginator, queryName, isEditSuccess])

  const columns: ColumnType<ListStudent>[] = [
    {
      title: 'No.',
      key: 'index',
      width: 60,
      fixed: 'left',
      render: (_value, _record, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 150,
      fixed: 'left',
      render: (_value, record) => (
        <Link href={`/dashboard/manager/students/${record.id}`}>
          {record.name}
        </Link>
      ),
    },
    {
      title: 'Area',
      dataIndex: 'country',
      width: 100,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      width: 220,
    },
    {
      title: 'Selected Curriculum',
      dataIndex: 'courses',
      width: 200,
      render: (courses: CourseType[]) =>
        courses?.map((course) => course.name).join(', '),
    },
    {
      title: 'Student Type',
      dataIndex: 'type',
      width: 100,
      render: (type: StudentType) => type?.name,
    },
    {
      title: 'Join Time',
      dataIndex: 'createdAt',
      width: 100,
      render: (date: Date) =>
        formatDistanceToNow(new Date(date), { addSuffix: true }),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 100,
      render: (_value, record) => (
        <Space size="small">
          <a onClick={() => handleEdit(record)}>Edit</a>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDeleteConfirm(record.id)}
            okText="Confirm"
            cancelText="Cancel"
          >
            <a>Delete</a>
          </Popconfirm>
        </Space>
      ),
    },
  ]

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
              onClick={() => setIsModalVisible(true)}
            >
              Add
            </Button>
          </Col>
          <Col>
            <Input.Search
              placeholder="Search by name"
              onChange={debounce((e) => setQueryName(e.target.value), 1000)}
            />
          </Col>
        </Row>
        <Table
          rowKey={(record) => record.id.toString()}
          columns={columns}
          pagination={{
            defaultPageSize: 20,
            total,
            onChange: (page, limit) => setPaginator({ page, limit }),
          }}
          dataSource={data}
          scroll={{ y: 400 }}
        />
        <StudentModal
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          editContent={editContent}
          setEditContent={setEditContent}
          setIsEditSuccess={setIsEditSuccess}
        />
      </div>
    </Layout>
  )
}
