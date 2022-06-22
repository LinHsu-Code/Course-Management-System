import {
  BulbOutlined,
  DesktopOutlined,
  SafetyOutlined,
} from '@ant-design/icons'
import { Col, Row, Card } from 'antd'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Overview from '../../../components/statistics/overview'
import { Entries, TeacherStatisticsGetByTeacher } from '../../../lib/model'
import { getTeacherStatistics } from '../../../lib/request'
import Pie from '../../../components/statistics/pie'
import Line from '../../../components/statistics/line'
import Heat from '../../../components/statistics/heat'
import { getUserInfo } from '../../../lib/util'

const overviewBackground = ['#1890ff', '#673bb7', '#ffaa16']

const overviewProps = {
  pending: { icon: <BulbOutlined /> },
  active: { icon: <DesktopOutlined /> },
  done: { icon: <SafetyOutlined /> },
}

function entries<T>(obj: T): Entries<T> {
  return Object.entries(obj) as any
}

export default function Page() {
  const [teacherStatistics, setTeacherStatistics] =
    useState<TeacherStatisticsGetByTeacher | null>(null)
  const [overview, setOverview] = useState<{
    pending: number
    active: number
    done: number
  } | null>(null)
  const [total, setTotal] = useState(0)

  const userInfo = getUserInfo()

  useEffect(() => {
    userInfo.userId &&
      getTeacherStatistics({ userId: userInfo.userId }).then((res) => {
        if (res.data) {
          const data = res.data as TeacherStatisticsGetByTeacher
          setTeacherStatistics(data)
          setTotal(data.status.reduce((acc, cur) => acc + cur.amount, 0))

          setOverview(
            data.status.reduce(
              (acc, curr) => {
                switch (curr.name) {
                  case '0':
                    acc.pending = acc.pending + curr.amount
                    break
                  case '1':
                    acc.active = acc.active + curr.amount
                    break
                  case '2':
                    acc.done = acc.done + curr.amount
                    break
                  default:
                    break
                }
                return acc
              },
              {
                pending: 0,
                active: 0,
                done: 0,
              }
            )
          )
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
            const percentage = parseFloat(String((value / total) * 100))
            return (
              <Col key={index} span={24} xl={{ span: 8 }}>
                <Overview
                  backgroundColor={overviewBackground[index]}
                  icon={overviewProps[key].icon}
                  title={`${item[0]}`.toUpperCase()}
                  data={value}
                  percentage={percentage}
                  dataDescription={`courses in ${key}`}
                />
              </Col>
            )
          })}
      </Row>

      <Row gutter={[6, 16]} style={{ marginBottom: 16 }}>
        <Col span={24} xl={{ span: 12 }}>
          <Card title="Course Category">
            {teacherStatistics && (
              <Pie data={teacherStatistics.type} title={'course'} />
            )}
          </Card>
        </Col>

        <Col span={24} xl={{ span: 12 }}>
          <Card title="Course Increment">
            <Line
              data={{
                course: teacherStatistics?.createdAt || null,
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[6, 16]}>
        <Col span={24}>
          <Card title="Course Schedule">
            {teacherStatistics && (
              <Heat
                data={teacherStatistics.classTime}
                title="Course schedule per weekday"
              />
            )}
          </Card>
        </Col>
      </Row>
    </>
  )
}
