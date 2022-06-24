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
  StudentStatistics,
  TeacherStatistics,
  CourseStatistics,
  GetStudentStatisticsResponse,
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
import Heat from '../../../components/statistics/heat'
import { getUserInfo, entries } from '../../../lib/util'
import { OverviewBackground } from '../../../lib/constants'

const overviewProps = {
  student: { icon: <SolutionOutlined /> },
  teacher: { icon: <DeploymentUnitOutlined /> },
  course: { icon: <ReadOutlined /> },
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

  const userInfo = getUserInfo()

  useEffect(() => {
    getStatisticsOverview().then((res) => {
      if (res.data) {
        setOverview(res.data)
      }
    })
    userInfo.userId &&
      getStudentStatistics<GetStudentStatisticsResponse>({
        userId: userInfo.userId,
      }).then((res) => {
        if (res.data) {
          setStudentStatistics(res.data)
        }
      })

    getTeacherStatistics().then((res) => {
      if (res.data) {
        setTeacherStatistics(res.data as TeacherStatistics)
      }
    })

    getCourseStatistics().then((res) => {
      if (res.data) {
        setCourseStatistics(res.data)
      }
    })
  }, [userInfo.userId])

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Overview'}</title>
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
                  backgroundColor={OverviewBackground[index]}
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
            {studentStatistics && teacherStatistics && (
              <Map
                data={
                  distributionRole === 'student'
                    ? studentStatistics.country
                    : teacherStatistics.country
                }
                title={distributionRole}
              />
            )}
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
            {studentStatistics && teacherStatistics && (
              <Bar
                studentInterests={studentStatistics.interest}
                teacherSkills={teacherStatistics.skills}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[6, 16]}>
        <Col span={24}>
          <Card title="Course Schedule">
            {courseStatistics && (
              <Heat
                data={courseStatistics.classTime}
                title="Course schedule per weekday"
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  )
}
