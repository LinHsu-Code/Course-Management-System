import { Popconfirm, Rate, Space, Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { getCourses, deleteCourse } from '../../lib/request'
import {
  CourseDurationUnit,
  CourseStatusColor,
  CourseStatusText,
} from '../../lib/constants'
import { useDataListLoad } from '../../hooks/dataListLoad'
import { Course, Courses, CourseType, GetCoursesRequest } from '../../lib/model'
import { getUserInfo } from '../../lib/util'

export function CourseListTableMode({ query }: { query: string }) {
  const {
    setQueryParams,
    data: courses,
    queryParams,
    total,
    setData,
  } = useDataListLoad<GetCoursesRequest, Courses, Course>(
    getCourses,
    'courses',
    false
  )

  const userInfo = getUserInfo()

  useEffect(() => {
    if (query) {
      console.log('query:', query)
      setQueryParams({
        paginator: { page: 1, limit: 20 },
        queries: { name: query },
      })
    }
  }, [query, setQueryParams])

  const columns: ColumnType<Course>[] = [
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
      sorter: (a: Course, b: Course) =>
        a.name.charCodeAt(0) - b.name.charCodeAt(0),
      render: (_value, record) => (
        <Link href={`/dashboard/${userInfo.role}/courses/${record.id}`}>
          <a>{record.name}</a>
        </Link>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'type',
      width: 130,
      render: (value: CourseType[]) =>
        value!.map((item) => item.name).join(', '),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      width: 100,
      render: (value) => (
        <span style={{ color: CourseStatusColor[value] }}>
          {CourseStatusText[value]}
        </span>
      ),
    },
    {
      title: 'Star',
      dataIndex: 'star',
      width: 180,
      render: (value: number) => <Rate value={value} disabled />,
    },
    {
      title: 'StartTime',
      dataIndex: 'startTime',
      width: 180,
    },
    {
      title: 'Duration',
      dataIndex: 'duration',
      width: 120,
      render: (value, record) =>
        `${value} ${CourseDurationUnit[record.durationUnit - 1]}`,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      width: 100,
      render: (_value, record) => (
        <Space size="small">
          <Link
            href={`/dashboard/${userInfo.role}/courses/edit-course?uid=${record.uid}`}
          >
            Edit
          </Link>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => {
              deleteCourse(record.id).then((res) => {
                if (res.data) {
                  setData(courses.filter((item) => item.id !== record.id))
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
      dataSource={courses}
    />
  )
}
