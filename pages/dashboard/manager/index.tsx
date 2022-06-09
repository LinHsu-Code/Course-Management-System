import {
  DeploymentUnitOutlined,
  ReadOutlined,
  SolutionOutlined,
} from '@ant-design/icons'
import { Col, Row } from 'antd'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import Overview from '../../../components/statistics/overview'
import { StatisticsOverview, Entries } from '../../../lib/model'
import { getStatisticsOverview } from '../../../lib/request/statistics'

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

  useEffect(() => {
    getStatisticsOverview().then((res) => {
      if (res) {
        setOverview(res.data)
      }
    })
  }, [])

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Manager'}</title>
      </Head>
      <Row>
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
    </>
  )
}
