import Head from 'next/head'
import Link from 'next/link'
import type { ReactElement } from 'react'
import { useState, useEffect } from 'react'
import { Table, Space, Input, Button, Row, Col } from 'antd'
import DashboardLayout from '../../../../components/dashboardLayout'
import { getStudentList } from '../../../../lib/httpRequest'
import { formatDistanceToNow } from 'date-fns'
import { PlusOutlined } from '@ant-design/icons'

export default function Dashboard() {
  const [paginator, setPaginator] = useState({ page: 1, limit: 20 })
  const [total, setTotal] = useState(0)
  const [data, setData] = useState([])

  useEffect(() => {
    getStudentList(paginator).then((res) => {
      if (res.data) {
        setTotal(res.data.total)
        setData(res.data.students)
      }
    })
  }, [paginator])

  const columns = [
    {
      title: 'No.',
      key: 'index',
      width: 60,
      fixed: 'left',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      width: 150,
      fixed: 'left',
      render: (text, record) => (
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
      render: (courses: []) => courses?.map((course) => course.name).join(', '),
    },
    {
      title: 'Student Type',
      dataIndex: 'type',
      width: 100,
      render: (type) => type?.name,
    },
    {
      title: 'Join Time',
      dataIndex: 'createdAt',
      width: 100,
      render: (date) =>
        formatDistanceToNow(new Date(date), { addSuffix: true }),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 100,
      render: (text, record: object) => (
        <Space size="middle">
          <a>Edit</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Manager'}</title>
      </Head>
      <div>
        <Row style={{ justifyContent: 'space-between', marginBottom: 16 }}>
          <Col>
            <Button type="primary" icon={<PlusOutlined />}>
              Add
            </Button>
          </Col>
          <Col>
            <Input.Search placeholder="Search by name" />
          </Col>
        </Row>
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          pagination={{
            defaultPageSize: 20,
            total,
            onChange: (page, limit) => setPaginator({ page, limit }),
          }}
          dataSource={data}
          scroll={{ y: 300 }}
        />
      </div>
    </>
  )
}

Dashboard.getLayout = function getLayout(data: any, component: ReactElement) {
  return <DashboardLayout>{component}</DashboardLayout>
}
