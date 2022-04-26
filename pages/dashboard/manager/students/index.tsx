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
import { COUNTRY_LIST, STUDENT_TYPE } from '../../../../lib/constants'

export default function Dashboard() {
  const [query, setQuery] = useState({
    paginator: { page: 1, limit: 20 },
    queryName: '',
  })
  const [total, setTotal] = useState(0)
  const [data, setData] = useState([])
  const [editContent, setEditContent] = useState({})
  const [isModalSuccess, setIsModalSuccess] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)

  const fetchStudentList = (
    paginator: { page: number; limit: number },
    queryName: string
  ) => {
    const params = queryName
      ? { ...paginator, query: queryName }
      : { ...paginator }
    getStudentList(params).then((res) => {
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

  const handleEdit = async (record: ListStudent) => {
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
      fetchStudentList(query.paginator, query.queryName)
    }
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery({ paginator: { page: 1, limit: 20 }, queryName: e.target.value })
  }

  useEffect(() => {
    console.log('useEffect')
    fetchStudentList(query.paginator, query.queryName)
    isModalSuccess && setIsModalSuccess(false)
  }, [query, isModalSuccess])

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
      sorter: (a: ListStudent, b: ListStudent) =>
        a.name.charCodeAt(0) - b.name.charCodeAt(0),
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
      filters: COUNTRY_LIST.map((item) => ({ text: item, value: item })),
      onFilter: (value, record) => value === record.country,
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
      filters: STUDENT_TYPE.map((item) => ({
        text: item,
        value: item.toLowerCase(),
      })),
      onFilter: (value, record) => value === record.type?.name,
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
        <Table
          rowKey={(record) => record.id.toString()}
          columns={columns}
          pagination={{
            defaultPageSize: 20,
            defaultCurrent: 1,
            current: query.paginator.page,
            total,
            onChange: (page, limit) =>
              setQuery({
                paginator: { page, limit },
                queryName: query.queryName,
              }),
          }}
          dataSource={data}
          scroll={{ y: 400 }}
        />
        {!isModalSuccess && (
          <StudentModal
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            editContent={editContent}
            setEditContent={setEditContent}
            setIsEditSuccess={setIsModalSuccess}
          />
        )}
      </div>
    </Layout>
  )
}
