import Link from 'next/link'
import { Table, Space, Popconfirm } from 'antd'
import { Teacher, Skill } from '../../lib/model'
import { ColumnType } from 'antd/lib/table'
import { deleteTeacher } from '../../lib/request'
import { COUNTRY_LIST } from '../../lib/constants'
import { Dispatch, SetStateAction } from 'react'
import { getUserInfo } from '../../lib/util'

export default function TeacherTable({
  data,
  total,
  queryParams,
  setData,
  setQueryParams,
  setEditContent,
  setIsModalVisible,
}: {
  data: Teacher[]
  total: number
  queryParams: any
  setData: Dispatch<SetStateAction<Teacher[]>>
  setQueryParams: Dispatch<
    SetStateAction<{ paginator: { page: number; limit: number }; queries: {} }>
  >
  setEditContent: Dispatch<SetStateAction<Teacher | null>>
  setIsModalVisible: (param: boolean) => void
}) {
  const userInfo = getUserInfo()

  const columns: ColumnType<Teacher>[] = [
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
      // sortDirections: ['ascend', 'descend'],
      sorter: (a: Teacher, b: Teacher) =>
        a.name.charCodeAt(0) - b.name.charCodeAt(0),
      render: (_value, record) => (
        <Link href={`/dashboard/${userInfo.role}/teachers/${record.id}`}>
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
      title: 'Skill',
      dataIndex: 'skills',
      width: 200,
      render: (skills: Skill[]) => skills?.map((item) => item.name).join(','),
    },
    {
      title: 'Course Amount',
      dataIndex: 'courseAmount',
      width: 100,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      width: 100,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 100,
      render: (_value, record) => (
        <Space size="small">
          <a
            onClick={() => {
              setEditContent(record)
              setIsModalVisible(true)
            }}
          >
            Edit
          </a>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              deleteTeacher(record.id).then((res) => {
                if (res.data) {
                  setData(data.filter((item) => item.id !== record.id))
                }
              })
            }}
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
        current: queryParams.paginator.page,
        total: total,
        onChange: (page, limit) =>
          setQueryParams((prev) => ({
            ...prev,
            paginator: { page, limit },
          })),
      }}
      dataSource={data}
    />
  )
}
