import Head from 'next/head'
import { Col, Input, Row, Select } from 'antd'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import Table, { ColumnType } from 'antd/lib/table'
import {
  Course,
  Courses,
  CourseType,
  GetCoursesRequest,
} from '../../../../../lib/model'
import Link from 'next/link'
import {
  CourseDurationUnit,
  CourseStatusColor,
  CourseStatusText,
} from '../../../../../lib/constants'
import { getCourses } from '../../../../../lib/request'
import { getUserInfo } from '../../../../../lib/util'
import { useDataListLoad } from '../../../../../hooks/dataListLoad'
import { formatDistanceToNow } from 'date-fns'
import { SearchOutlined } from '@ant-design/icons'

export default function Page() {
  const [query, setQuery] = useState<string>('')
  const [searchBy, setSearchBy] = useState<'name' | 'type'>('name')

  const userInfo = getUserInfo()

  const {
    setQueryParams,
    data: courses,
    queryParams,
    total,
  } = useDataListLoad<GetCoursesRequest, Courses, Course>(
    getCourses,
    'courses',
    false,
    { userId: userInfo.userId }
  )

  useEffect(() => {
    if (query) {
      setQueryParams({
        paginator: { page: 1, limit: 20 },
        queries: { [searchBy]: query },
      })
    }
  }, [query, searchBy, setQueryParams])

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
    // {
    //   title: 'Category',
    //   dataIndex: 'type',
    //   width: 130,
    //   render: (value: CourseType[]) =>
    //     value!.map((item) => item.name).join(', '),
    // },
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
      title: 'Join Time',
      dataIndex: 'createdAt',
      width: 100,
      render: (date: Date) =>
        formatDistanceToNow(new Date(date), { addSuffix: true }),
    },
  ]

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Course List'}</title>
      </Head>
      <div style={{ overflowX: 'auto' }}>
        <Row style={{ marginBottom: 16 }}>
          <Col>
            <Input
              onChange={debounce((e) => {
                setQuery(e.target.value)
              }, 1000)}
              addonBefore={
                <Select
                  defaultValue="name"
                  onChange={(value: 'name' | 'type') => setSearchBy(value)}
                >
                  <Select.Option value="name">Name</Select.Option>
                  <Select.Option value="type">Category</Select.Option>
                </Select>
              }
              addonAfter={<SearchOutlined />}
              placeholder={`Search by ${searchBy}`}
            />
          </Col>
        </Row>

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
      </div>
    </>
  )
}
