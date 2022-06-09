import {
  DeploymentUnitOutlined,
  ReadOutlined,
  SolutionOutlined,
} from '@ant-design/icons'
import { Col, Row, Card, Select } from 'antd'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Overview from '../../../components/statistics/overview'
import {
  StatisticsOverview,
  Entries,
  StudentStatistics,
  TeacherStatistics,
  CourseStatistics,
} from '../../../lib/model'
import {
  getStatisticsOverview,
  getStudentStatistics,
  getTeacherStatistics,
  getCourseStatistics,
} from '../../../lib/request'
import Map from '../../../components/statistics/map'

const overviewBackground = ['#1890ff', '#673bb7', '#ffaa16']

const overviewProps = {
  student: { icon: <SolutionOutlined /> },
  teacher: { icon: <DeploymentUnitOutlined /> },
  course: { icon: <ReadOutlined /> },
}

function entries<T>(obj: T): Entries<T> {
  return Object.entries(obj) as any
}

export default function Page() {
  const [overview, setOverview] = useState<StatisticsOverview | null>(null)
  const [studentStatistics, setStudentStatistics] =
    useState<StudentStatistics | null>(null)
  const [teacherStatistics, setTeacherStatistics] =
    useState<TeacherStatistics | null>(null)
  const [courseStatistics, setCourseStatistics] =
    useState<CourseStatistics | null>(null)
  const [distributionRole, setDistributionRole] = useState<string>('student')

  useEffect(() => {
    getStatisticsOverview().then((res) => {
      if (res) {
        setOverview(res.data)
      }
    })
    getStudentStatistics().then((res) => {
      if (res) {
        setStudentStatistics(res.data)
      }
    })
    getTeacherStatistics().then((res) => {
      if (res) {
        setTeacherStatistics(res.data)
      }
    })
    getCourseStatistics().then((res) => {
      if (res) {
        setCourseStatistics(res.data)
      }
    })
  }, [])

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Manager'}</title>
      </Head>
      <Row gutter={[6, 16]}>
        {overview &&
          entries(overview).map((item, index) => {
            const [key, value] = item
            const percentage = parseFloat(
              String((value.lastMonthAdded / value.total) * 100)
            )
            return (
              <Col key={index} span={24} xl={{ span: 8 }}>
                <Overview
                  backgroundColor={overviewBackground[index]}
                  icon={overviewProps[key].icon}
                  title={`total ${item[0]}s`.toUpperCase()}
                  data={value.total}
                  percentage={percentage}
                  dataDescription="Increase in 30 Days"
                />
              </Col>
            )
          })}
      </Row>

      <Row gutter={[6, 16]}>
        <Col span={24} xl={{ span: 12 }}>
          <Card
            title="Distribution"
            extra={
              <Select
                defaultValue="student"
                onSelect={setDistributionRole}
                bordered={false}
              >
                <Select.Option value="student">Student</Select.Option>
                <Select.Option value="teacher">Teacher</Select.Option>
              </Select>
            }
          >
            <Map
              data={
                distributionRole === 'student'
                  ? studentStatistics?.country || null
                  : teacherStatistics?.country || null
              }
              title={distributionRole}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
