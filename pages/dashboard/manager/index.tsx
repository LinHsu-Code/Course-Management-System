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
import Pie from '../../../components/statistics/pie'
import Line from '../../../components/statistics/line'
import Bar from '../../../components/statistics/bar'

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
  const [selectedType, setSelectedType] = useState<string>('student_type')

  console.log('overview:', overview)
  console.log('studentStatistics:', studentStatistics)
  console.log('teacherStatistics:', teacherStatistics)
  console.log('courseStatistics:', courseStatistics)

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
      <Row gutter={[6, 16]} style={{ marginBottom: 16 }}>
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

      <Row gutter={[6, 16]} style={{ marginBottom: 16 }}>
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

        <Col span={24} xl={{ span: 12 }}>
          <Card
            title="Types"
            extra={
              <Select
                defaultValue={selectedType}
                bordered={false}
                onSelect={setSelectedType}
              >
                <Select.Option value="student_type">Student Type</Select.Option>
                <Select.Option value="course_type">Course Type</Select.Option>
                <Select.Option value="gender">Gender</Select.Option>
              </Select>
            }
          >
            {selectedType === 'student_type' && studentStatistics ? (
              <Pie data={studentStatistics.type} title={selectedType} />
            ) : selectedType === 'course_type' && courseStatistics ? (
              <Pie data={courseStatistics.type} title={selectedType} />
            ) : (
              overview && (
                <Row gutter={6}>
                  <Col span={12}>
                    <Pie
                      data={Object.entries(overview.student.gender).map(
                        ([name, amount]) => ({
                          name,
                          amount,
                        })
                      )}
                      title="student gender"
                    />
                  </Col>

                  <Col span={12}>
                    <Pie
                      data={Object.entries(overview.teacher.gender).map(
                        ([name, amount]) => ({
                          name,
                          amount,
                        })
                      )}
                      title="teacher gender"
                    />
                  </Col>
                </Row>
              )
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[6, 16]} style={{ marginBottom: 16 }}>
        <Col span={24} xl={{ span: 12 }}>
          <Card title="Increment">
            <Line
              data={{
                student: studentStatistics?.createdAt || null,
                teacher: teacherStatistics?.createdAt || null,
                course: courseStatistics?.createdAt || null,
              }}
            />
          </Card>
        </Col>

        <Col span={24} xl={{ span: 12 }}>
          <Card title="Languages">
            <Bar
              data={{
                interest: studentStatistics?.interest || null,
                teacher: teacherStatistics?.skills || null,
              }}
            />
          </Card>
        </Col>
      </Row>
    </>
  )
}
