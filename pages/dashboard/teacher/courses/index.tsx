import Head from 'next/head'
import { Col, Input, Rate, Row, Space, Switch, Tooltip, Popconfirm } from 'antd'
import { debounce } from 'lodash'
import React, { useEffect, useState } from 'react'
import CourseListScrollMode from '../../../../components/course/courseListScrollMode'
import Table, { ColumnType } from 'antd/lib/table'
import {
  Course,
  Courses,
  CourseType,
  GetCoursesRequest,
} from '../../../../lib/model'
import Link from 'next/link'
import {
  CourseDurationUnit,
  CourseStatusColor,
  CourseStatusText,
} from '../../../../lib/constants'
import { deleteCourse, getCourses } from '../../../../lib/request'
import { getUserInfo } from '../../../../lib/util'
import { useDataListLoad } from '../../../../hooks/dataListLoad'

export default function Page() {
  const [isScroll, setIsScroll] = useState<boolean>(false)
  const [query, setQuery] = useState<string>('')

  const userInfo = getUserInfo()

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

  useEffect(() => {
    if (query) {
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
    <>
      <Head>
        <title>{'CMS DashBoard: Course List'}</title>
      </Head>
      <div style={{ overflowX: 'auto' }}>
        <Row style={{ justifyContent: 'space-between', marginBottom: 16 }}>
          <Col>
            {!isScroll && (
              <Input.Search
                placeholder="Search by name"
                onChange={debounce((e) => {
                  setQuery(e.target.value)
                }, 1000)}
              />
            )}
          </Col>

          <Col>
            <Tooltip title="switch to grid mode">
              <Switch
                checkedChildren="on"
                unCheckedChildren="off"
                onChange={setIsScroll}
              />
            </Tooltip>
          </Col>
        </Row>

        {isScroll ? (
          <CourseListScrollMode />
        ) : (
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
        )}
      </div>
    </>
  )
}
