import Head from 'next/head'
import { Input, Space, Modal } from 'antd'
import { getStudents, postMessage } from '../../../../lib/request'
import {
  CourseType,
  GetStudentsRequest,
  Student,
  Students,
  StudentType,
} from '../../../../lib/model'
import { useDataListLoad } from '../../../../hooks/dataListLoad'
import { getUserInfo } from '../../../../lib/util'
import Table, { ColumnType } from 'antd/lib/table'
import Link from 'next/link'
import { COUNTRY_LIST, STUDENT_TYPE } from '../../../../lib/constants'
import TextLink from 'antd/lib/typography/Link'

export default function Page() {
  const userInfo = getUserInfo()

  const { data, queryParams, setQueryParams, total } = useDataListLoad<
    GetStudentsRequest,
    Students,
    Student
  >(getStudents, 'students', false)

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
        courses?.map((course, index) => (
          <p key={index}>
            <Link
              href={`/dashboard/${userInfo.role}/courses/${course.courseId}`}
            >{`${index + 1}. ${course.name}`}</Link>
          </p>
        )),
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
      title: 'Actions',
      dataIndex: 'action',
      render: (_, record: Student) => (
        <Space size="middle">
          <TextLink
            onClick={() => {
              let msg = ''

              Modal.info({
                title: `Notify ${record.name}`,
                content: (
                  <Input
                    placeholder="Please input a message"
                    onChange={(event) => (msg = event.target.value)}
                  />
                ),
                onOk: (close) => {
                  //   userInfo.userId &&
                  //     postMessage({
                  //       from: userInfo.userId,
                  //       to: record.id,
                  //       content: msg,
                  //       alertAt: msg,
                  //     })
                  close()
                },
              })
            }}
          >
            Notify
          </TextLink>
        </Space>
      ),
    },
  ]

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Student List'}</title>
      </Head>
      <div style={{ overflowX: 'auto' }}>
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
      </div>
    </>
  )
}
