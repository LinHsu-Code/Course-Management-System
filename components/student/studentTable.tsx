import Link from 'next/link'
import { Table, Space, Popconfirm } from 'antd'
import { formatDistanceToNow } from 'date-fns'
import { Student, CourseType, StudentType } from '../../lib/model'
import { ColumnType } from 'antd/lib/table'
import { deleteStudent } from '../../lib/request'
import { COUNTRY_LIST, STUDENT_TYPE } from '../../lib/constants'
import { useUserInfo } from '../../hooks/user'

export default function StudentTable(props: any) {
  const userInfo = useUserInfo()

  const handleEditClick = async (record: Student) => {
    props.setEditContent({
      name: record.name,
      email: record.email,
      country: record.country,
      type: record.type?.id,
      id: record.id,
    })
    props.setIsModalVisible(true)
  }

  const handleDelete = async (id: number) => {
    const res = await deleteStudent(id)
    if (res.data) {
      props.fetchStudents(props.queryParams)
    }
  }

  const columns: ColumnType<Student>[] = [
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
      sorter: (a: Student, b: Student) =>
        a.name.charCodeAt(0) - b.name.charCodeAt(0),
      render: (_value, record) => (
        <Link href={`/dashboard/${userInfo.role}/students/${record.id}`}>
          <a>{record.name}</a>
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
          <a onClick={() => handleEditClick(record)}>Edit</a>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.id)}
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
    <Table
      rowKey="id"
      columns={columns}
      pagination={{
        defaultPageSize: 20,
        defaultCurrent: 1,
        current: props.queryParams.paginator.page,
        total: props.total,
        onChange: (page, limit) =>
          props.setQueryParams({
            paginator: { page, limit },
            queryName: props.queryParams.queryName,
          }),
      }}
      dataSource={props.data}
    />
  )
}
