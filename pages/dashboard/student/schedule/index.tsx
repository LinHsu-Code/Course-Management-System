import Head from 'next/head'
import { Badge, Calendar, Card, Descriptions, Modal, Tag, Tooltip } from 'antd'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import { Course, CourseWithSchedule } from '../../../../lib/model'
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
import { ClockCircleOutlined, NotificationFilled } from '@ant-design/icons'
import { PROGRAM_LANGUAGE_COLORS } from '../../../../lib/constants'

const getCurrentChapterInfo = (course: CourseWithSchedule) => {
  if (course.schedule.status === 2) {
    return null
  }
  let index = 0
  if (course.schedule.current !== 0) {
    index = course.schedule.chapters.findIndex(
      (item) => item.id === course.schedule.current
    )
  }

  return course.schedule.chapters
    ? {
        chapterNO: index + 1,
        chapterName: course.schedule.chapters[index].name,
        chapterContent: course.schedule.chapters[index].content,
      }
    : null
}

export default function Page() {
  const [classSchedule, setClassSchedule] = useState<
    CourseWithSchedule[] | null
  >(null)

  const [classInfo, setClassInfo] = useState<{
    course: CourseWithSchedule
    time: string | null
    currentChapterInfo: {
      chapterNO: number
      chapterName: string
      chapterContent: string
    } | null
    isFutureClass: boolean
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

    const cellDay = currentCellDate.toDate()
    const currentWeekday = format(cellDay, 'EEEE')
    const currentDay = new Date()

    const addFns = [addYears, addMonths, addDays, addWeeks, addHours]

    const listData = classSchedule.map((course) => {
      const startDay = new Date(course.startTime)
      const endDay = addFns[course.durationUnit - 1](
        new Date(course.startTime),
        course.duration
      )
      const theDayBeforeStart = subDays(startDay, 1)
      const theDayAfterEnd = addDays(endDay, 1)

      const sameWeekdayTime =
        course.schedule.classTime
          .find((item) => item.startsWith(currentWeekday))
          ?.split(' ')[1] || null

      const hasCourse =
        course.durationUnit === 5
          ? isSameDay(startDay, cellDay)
          : isBefore(theDayBeforeStart, cellDay) &&
            isAfter(theDayAfterEnd, cellDay) &&
            sameWeekdayTime

      return hasCourse
        ? {
            course,
            time: sameWeekdayTime,
            currentChapterInfo: getCurrentChapterInfo(course),
            isFutureClass:
              isAfter(cellDay, currentDay) || isSameDay(cellDay, currentDay),
          }
        : null
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
            <Descriptions.Item span={8} label="Class Name">
              {classInfo?.course.name}
            </Descriptions.Item>

            <Descriptions.Item span={8} label="Class Type">
              {classInfo?.course.type.map((item, index) => (
                <Tag
                  color={
                    PROGRAM_LANGUAGE_COLORS[
                      index % PROGRAM_LANGUAGE_COLORS.length
                    ]
                  }
                  key={item.name}
                >
                  {item.name}
                </Tag>
              ))}
            </Descriptions.Item>

            <Descriptions.Item span={8} label="Teacher Name">
              {classInfo?.course.teacherName}
            </Descriptions.Item>

            <Descriptions.Item span={8} label="Class Time">
              {classInfo?.time}
              {classInfo?.isFutureClass && (
                <Tooltip title="Remend me">
                  <NotificationFilled
                    style={{
                      color: '#1890ff',
                      marginLeft: 10,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      setClassInfo(null)
                    }}
                  />
                </Tooltip>
              )}
            </Descriptions.Item>
            {classInfo?.course.status === 2 ? (
              <Descriptions.Item span={8} label="Class Status">
                <Badge status="success" text="Finished" />
              </Descriptions.Item>
            ) : (
              <>
                <Descriptions.Item span={8} label="Chapter N.O">
                  {classInfo?.currentChapterInfo?.chapterNO}
                </Descriptions.Item>

                <Descriptions.Item span={8} label="Chapter Name">
                  {classInfo?.currentChapterInfo?.chapterName}
                </Descriptions.Item>
                <Descriptions.Item span={12} label="Chapter Content">
                  {classInfo?.currentChapterInfo?.chapterContent}
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        </Modal>
      </div>
    </>
  )
}
