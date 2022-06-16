import Head from 'next/head'
import { Badge, Calendar, Card, Descriptions, Modal } from 'antd'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import { CourseWithSchedule } from '../../../../lib/model'
import { getClassSchedule } from '../../../../lib/request'
import type { Moment } from 'moment'
import {
  isAfter,
  isBefore,
  subDays,
  addYears,
  addMonths,
  addDays,
  addWeeks,
  addHours,
  format,
  isSameDay,
} from 'date-fns'
import { ClockCircleOutlined } from '@ant-design/icons'

export default function Page() {
  const [classSchedule, setClassSchedule] = useState<
    CourseWithSchedule[] | null
  >(null)

  const [classInfo, setClassInfo] = useState<{
    course: CourseWithSchedule
    time: string | null
  } | null>(null)

  useEffect(() => {
    const userId = Number(localStorage.getItem('userId'))
    getClassSchedule({ userId }).then((res) => {
      if (res.data) {
        setClassSchedule(res.data)
        console.log(res.data)
      }
    })
  }, [])

  const monthCellRender = (value: Moment) => {
    return <></>
  }

  const dateCellRender = (currentCellDate: Moment) => {
    if (!classSchedule) {
      return null
    }

    const currentDate = currentCellDate.toDate()
    const currentWeekday = format(currentDate, 'EEEE')

    const addFns = [addYears, addMonths, addDays, addWeeks, addHours]

    const listData = classSchedule.map((course) => {
      const theDayBeforeStart = subDays(new Date(course.startTime), 1)
      const theDayAfterEnd = addDays(
        addFns[course.durationUnit - 1](
          new Date(course.startTime),
          course.duration
        ),
        1
      )

      const sameWeekdayTime =
        course.schedule.classTime
          .find((item) => item.startsWith(currentWeekday))
          ?.split(' ')[1] || null

      const hasCourse =
        course.durationUnit === 5
          ? isSameDay(new Date(course.startTime), currentDate)
          : isBefore(theDayBeforeStart, currentDate) &&
            isAfter(theDayAfterEnd, currentDate) &&
            sameWeekdayTime

      return hasCourse ? { course, time: sameWeekdayTime } : null
    })

    return (
      <>
        {listData.map((item, index) => {
          return item ? (
            <div key={index} onClick={() => setClassInfo(item)}>
              <ClockCircleOutlined /> {`${item.time} ${item.course.name}`}
            </div>
          ) : null
        })}
      </>
    )
  }

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Student-Schedule'}</title>
      </Head>
      <div>
        <Card title="My Class Schedule">
          <Calendar
            dateCellRender={dateCellRender}
            monthCellRender={monthCellRender}
          />
        </Card>

        <Modal
          title="Class Info"
          visible={!!classInfo}
          footer={null}
          onCancel={() => setClassInfo(null)}
        >
          <Descriptions>
            <Descriptions.Item span={8} label="Course Name">
              {classInfo?.course.name}
            </Descriptions.Item>
            <Descriptions.Item span={8} label="Chapter N.O">
              {/* {classInfo?.course.schedule.chapters.findIndex(
              (item) => item.id === classInfo?.class.chapter?.id
            ) + 1} */}
            </Descriptions.Item>
            <Descriptions.Item span={8} label="Course Type">
              {classInfo?.course.type[0]?.name}
            </Descriptions.Item>
            <Descriptions.Item span={8} label="Teacher Name">
              {classInfo?.course.teacherName}
            </Descriptions.Item>
            <Descriptions.Item span={8} label="Class Time">
              {classInfo?.course.schedule.classTime}

              {/* <Tooltip title="Remend me">
                <NotificationFilled
                  style={{
                    color: '#1890ff',
                    marginLeft: 10,
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    // TODO: class system;
                    setclassInfo(null)
                  }}
                />
              </Tooltip> */}
            </Descriptions.Item>
            <Descriptions.Item span={8} label="Chapter Name">
              {/* {classInfo?.class.chapter?.name} */}
            </Descriptions.Item>
            <Descriptions.Item span={12} label="Chapter Content">
              {/* {notifyInfo?.class.chapter?.content} */}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      </div>
    </>
  )
}
