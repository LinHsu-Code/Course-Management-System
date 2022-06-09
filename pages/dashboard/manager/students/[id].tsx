import Head from 'next/head'
import Link from 'next/link'
import { getStudent } from '../../../../lib/request'
import { useState, useEffect } from 'react'
import { Row, Col, Card, Tabs, Tag, Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { GetServerSideProps } from 'next/types'
import {
  CourseType,
  StudentDetail,
  StudentDetailCourse,
} from '../../../../lib/model'
import DetailInfoCard from '../../../../components/common/detailInfoCard'
import DetailAboutInfo from '../../../../components/common/detailAboutInfo'
import { PROGRAM_LANGUAGE_COLORS } from '../../../../lib/constants'

const { TabPane } = Tabs

export const getServerSideProps: GetServerSideProps = async (context) => {
  const id = context.query.id as string
  return {
    props: { id },
  }
}

export default function Page({ id }: { id: string }) {
  const [info, setInfo] = useState<
    { label: string; value: string | number | null; span: number }[]
  >([])
  const [about, setAbout] = useState<{ label: string; value: string | Date }[]>(
    []
  )
  const [student, setStudent] = useState<StudentDetail | null>(null)

  const columns: ColumnType<StudentDetailCourse>[] = [
    {
      title: 'No.',
      key: 'index',
      render: (_value, _record, index) => index + 1,
    },
    {
      title: 'Course Name',
      dataIndex: 'name',
      render: (value, record) => (
        <Link
          href={`/dashboard/${localStorage.getItem('role')}/courses/${
            record.id
          }`}
        >
          {value}
        </Link>
      ),
    },
    {
      title: 'Course Type',
      dataIndex: 'type',
      render: (type: CourseType[]) => type.map((item) => item.name).join(','),
    },
    {
      title: 'Register Time',
      dataIndex: 'createdAt',
    },
  ]

  useEffect(() => {
    ;(async () => {
      const { data: student } = await getStudent(id)
      const info = [
        { label: 'Name', value: student.name, span: 1 },
        { label: 'Age', value: student.age, span: 1 },
        { label: 'Email', value: student.email, span: 1 },
        { label: 'Phone', value: student.phone, span: 1 },
        { label: 'Address', value: student.address, span: 2 },
      ]
      const about = [
        { label: 'Eduction', value: student.education },
        { label: 'Area', value: student.country },
        { label: 'Gender', value: student.gender === 1 ? 'Male' : 'Female' },
        {
          label: 'Member Period',
          value: student.memberStartAt + ' - ' + student.memberEndAt,
        },
        { label: 'Type', value: student.type.name },
        { label: 'Create Time', value: student.createdAt },
        { label: 'Update Time', value: student.updatedAt },
      ]

      setInfo(info)
      setAbout(about)
      setStudent(student)
    })()
  }, [id])

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Student Detail'}</title>
      </Head>
      <Row gutter={[6, 16]}>
        <Col flex="0 1 400px">
          <DetailInfoCard info={info} />
        </Col>
        <Col flex="1 1 500px">
          <Card>
            <Tabs defaultActiveKey="1">
              <TabPane tab="About" key="1">
                <div>
                  <h3 className="detail_about_title">Information</h3>
                  <DetailAboutInfo about={about} />
                </div>
                <div>
                  <h3 className="detail_about_title">Interesting</h3>
                  <div>
                    {student?.interest.map((item, index) => (
                      <Tag
                        key={index}
                        color={
                          PROGRAM_LANGUAGE_COLORS[
                            index % PROGRAM_LANGUAGE_COLORS.length
                          ]
                        }
                      >
                        {item}
                      </Tag>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="detail_about_title">Description</h3>
                  <p>{student?.description}</p>
                </div>
              </TabPane>
              <TabPane tab="Courses" key="2">
                <Table
                  dataSource={student?.courses}
                  columns={columns}
                  rowKey="id"
                ></Table>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>
    </>
  )
}
