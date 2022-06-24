import Head from 'next/head'
import {
  BulbOutlined,
  CalendarFilled,
  DesktopOutlined,
  HeartFilled,
  ReloadOutlined,
  SafetyOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import {
  Card,
  Col,
  List,
  message,
  Row,
  Space,
  Statistic as StatisticComponent,
  Tooltip,
} from 'antd'
import { isFuture } from 'date-fns'
import { groupBy } from 'lodash'
import Link from 'next/link'
import React, { Reducer, useEffect, useReducer, useState } from 'react'
import styled from 'styled-components'
import {
  GetStudentStatisticsByStudentResponse,
  StatisticsCourseDetail,
  StudentStatisticsByStudent,
} from '../../../lib/model'
import { getCourses, getStudentStatistics } from '../../../lib/request'
import { entries, getUserInfo } from '../../../lib/util'
import Overview from '../../../components/statistics/overview'
import {
  CourseDurationUnit,
  CourseStatus,
  OverviewBackground,
} from '../../../lib/constants'
import Image from 'next/image'

interface StoreState {
  page: number
  max: number
  recommend: StatisticsCourseDetail[]
}

type ActionType = 'increment' | 'reset' | 'setMax' | 'setRecommend'

type Action = {
  type: ActionType
  payload?: number | StatisticsCourseDetail[]
}

const { Countdown } = StatisticComponent

const IconText = ({
  icon,
  text,
}: {
  icon: JSX.Element
  text: string | number
}) => (
  <Space>
    {icon}
    {text}
  </Space>
)

const StyledList = styled(List)`
  .ant-list-item {
    position: relative;
  }
  .ant-list-item-action {
    position: absolute;
    left: 240px;
    bottom: 30px;
  }
  .ant-list-item-meta-description {
    display: -webkit-box;
    max-width: 100%;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

const initialState: StoreState = { page: 1, max: 0, recommend: [] }

const limit = 5

function reducer(state: StoreState, action: Action): StoreState {
  switch (action.type) {
    case 'increment':
      return { ...state, page: state.page + 1 }
    case 'reset':
      return { ...state, page: 1 }
    case 'setMax':
      return { ...state, max: action.payload as number }
    case 'setRecommend':
      return { ...state, recommend: action.payload as StatisticsCourseDetail[] }
    default:
      throw new Error()
  }
}

const overviewProps = {
  pending: { icon: <BulbOutlined /> },
  active: { icon: <DesktopOutlined /> },
  done: { icon: <SafetyOutlined /> },
}

export default function Page() {
  const [data, setData] = useState<StudentStatisticsByStudent | null>(null)
  const [overview, setOverview] = useState<{
    pending: number
    active: number
    done: number
  }>({
    pending: 0,
    active: 0,
    done: 0,
  })

  const [total, setTotal] = useState(0)
  const [state, dispatch] = useReducer<Reducer<StoreState, Action>>(
    reducer,
    initialState
  )

  const userInfo = getUserInfo()

  const changeBatch = async () => {
    try {
      const { page } = state
      const current = page * limit > state.max ? 1 : page
      const {
        data: { courses, total },
      } = await getCourses({ page: current, limit })

      dispatch({ type: page * limit > total ? 'reset' : 'increment' })

      if (total !== state.max) {
        dispatch({ type: 'setMax', payload: total })
      }

      dispatch({ type: 'setRecommend', payload: courses })
    } catch (err) {
      message.error('Server is busy, please try again later!')
    }
  }

  useEffect(() => {
    userInfo.userId &&
      getStudentStatistics<GetStudentStatisticsByStudentResponse>({
        userId: userInfo.userId,
      }).then((res) => {
        if (res.data) {
          const { data } = res
          const { own, recommend } = data

          setTotal(own.courses.length)
          setOverview((pre) => {
            return Object.entries(
              groupBy(own.courses, (item) => item.course.status)
            ).reduce(
              (acc, [status, values]) => ({
                ...acc,
                [CourseStatus[Number(status)]]: values.length,
              }),
              pre
            )
          })
          dispatch({ type: 'setRecommend', payload: recommend.courses })
          setData(data)
        }
      })

    return () => {}
  }, [userInfo.userId])

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Overview-Student'}</title>
      </Head>

      <Row gutter={[6, 16]} style={{ marginBottom: 16 }}>
        {overview &&
          entries(overview).map((item, index) => {
            const [key, value] = item
            const percentage = parseFloat(String((value / total) * 100))
            return (
              <Col key={index} span={24} xl={{ span: 8 }}>
                <Overview
                  backgroundColor={OverviewBackground[index]}
                  icon={overviewProps[key].icon}
                  title={`${key}`.toUpperCase()}
                  data={value}
                  percentage={percentage}
                  dataDescription={`courses in ${key}`}
                />
              </Col>
            )
          })}
      </Row>

      {data && (
        <Card
          title={<h3> Courses you might be interested in </h3>}
          extra={
            <Tooltip title="Change batch">
              <ReloadOutlined
                onClick={changeBatch}
                style={{ color: '#1890ff', fontSize: 18, cursor: 'pointer' }}
              />
            </Tooltip>
          }
        >
          <StyledList
            id="container"
            itemLayout="vertical"
            size="large"
            dataSource={state.recommend}
            renderItem={(item, index) => (
              <List.Item
                key={index}
                extra={
                  <Countdown
                    title={
                      isFuture(
                        new Date((item as StatisticsCourseDetail).startTime)
                      )
                        ? 'Cutdown'
                        : 'In Progress'
                    }
                    value={new Date(
                      (item as StatisticsCourseDetail).startTime
                    ).getTime()}
                    format={'D 天 H 时 m 分 s 秒'}
                  />
                }
                actions={[
                  <IconText
                    icon={<TeamOutlined />}
                    text={(item as StatisticsCourseDetail).maxStudents}
                    key="list-vertical-limit-o"
                  />,
                  <IconText
                    icon={<HeartFilled />}
                    text={(item as StatisticsCourseDetail).star}
                    key="list-vertical-star-o"
                  />,
                  <IconText
                    icon={<CalendarFilled />}
                    text={
                      (item as StatisticsCourseDetail).duration +
                      ' ' +
                      CourseDurationUnit[
                        (item as StatisticsCourseDetail).durationUnit - 1
                      ]
                    }
                    key="list-vertical-calendar-o"
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <Image
                      alt="student cover"
                      src={(item as StatisticsCourseDetail).cover}
                      width="200px"
                      height="200px"
                    />
                  }
                  title={
                    <Link
                      href={`/dashboard/${userInfo.role}/courses/${
                        (item as StatisticsCourseDetail).id
                      }`}
                      passHref
                    >
                      {(item as StatisticsCourseDetail).name}
                    </Link>
                  }
                  description={(item as StatisticsCourseDetail).detail}
                ></List.Item.Meta>
              </List.Item>
            )}
          ></StyledList>
        </Card>
      )}
    </>
  )
}
