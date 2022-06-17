import Head from 'next/head'
import { Badge, Calendar, Card, Descriptions, Modal, Tag, Tooltip } from 'antd'
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
  startOfMonth,
  endOfMonth,
} from 'date-fns'
import { ClockCircleOutlined, NotificationFilled } from '@ant-design/icons'
import { PROGRAM_LANGUAGE_COLORS } from '../../../../lib/constants'
import { postMessage } from '../../../../lib/request'
import { useUserInfo } from '../../../../hooks/user'

const addFns = [addYears, addMonths, addDays, addWeeks, addHours]

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

const countClassTimes = (
  classTime: string[],
  startOfCellMonth: Date,
  endOfCellMonth: Date,
  startDay: Date,
  endDay: Date
) => {
  const startDayInThisMonth = isBefore(startDay, startOfCellMonth)
    ? startOfCellMonth
    : startDay
  const endDayInThisMonth = isAfter(endDay, endOfCellMonth)
    ? endOfCellMonth
    : endDay

  return classTime.reduce((acc, curr) => {
    const weekday = curr.split(' ')[0]
    let temp = startDayInThisMonth

    while (isBefore(temp, endDayInThisMonth)) {
      if (format(temp, 'EEEE') === weekday) {
        acc++
      }
      temp = addDays(temp, 1)
    }
    return acc
  }, 0)
}

export default function Page() {
  const [classSchedule, setClassSchedule] = useState<
    CourseWithSchedule[] | null
  >(null)

  const [classInfo, setClassInfo] = useState<{
    course: CourseWithSchedule
    time: string | null
    day: string
    currentChapterInfo: {
      chapterNO: number
      chapterName: string
      chapterContent: string
    } | null
    isFutureClass: boolean
  } | null>(null)

  const userInfo = useUserInfo()

  useEffect(() => {
    getClassSchedule({ userId: userInfo.userId }).then((res) => {
      if (res.data) {
        setClassSchedule(res.data)
      }
    })
  }, [userInfo.userId])

  const monthCellRender = (currentCellDate: Moment) => {
    if (!classSchedule) {
      return null
    }

    const startOfCellMonth = startOfMonth(currentCellDate.toDate())
    const endOfCellMonth = endOfMonth(currentCellDate.toDate())

    const listData = classSchedule.map((course) => {
      const startDay = new Date(course.startTime)
      const endDay = addFns[course.durationUnit - 1](
        new Date(course.startTime),
        course.duration
      )

      const notInThisMonth =
        isBefore(endDay, startOfCellMonth) || isAfter(startDay, endOfCellMonth)

      return notInThisMonth
        ? null
        : {
            courseName: course.name,
            courseTimes: countClassTimes(
              course.schedule.classTime,
              startOfCellMonth,
              endOfCellMonth,
              startDay,
              endDay
            ),
          }
    })
    return (
      <>
        {listData.map((item, index) => {
          return item ? (
            <div key={index}>
              <b>{item.courseName} </b>
              {`${item.courseTimes} lessons`}
            </div>
          ) : null
        })}
      </>
    )
  }

  const dateCellRender = (currentCellDate: Moment) => {
    if (!classSchedule) {
      return null
    }

    const cellDay = currentCellDate.toDate()
    const currentWeekday = format(cellDay, 'EEEE')
    const currentDay = new Date()

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
            day: format(cellDay, 'yyyy-MM-dd'),
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
            <Descriptions.Item span={3} label="Class Name">
              {classInfo?.course.name}
            </Descriptions.Item>

            <Descriptions.Item span={3} label="Class Type">
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

            <Descriptions.Item span={3} label="Teacher Name">
              {classInfo?.course.teacherName}
            </Descriptions.Item>

            <Descriptions.Item span={3} label="Class Time">
              {classInfo?.time}
              {classInfo?.isFutureClass && (
                <Tooltip title="Remind Me">
                  <NotificationFilled
                    style={{
                      color: '#1890ff',
                      marginLeft: 10,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      postMessage({
                        from: userInfo.userId,
                        to: userInfo.userId,
                        content: `You have a ${classInfo?.course.name} course at ${classInfo?.time} ${classInfo?.day}`,
                        alertAt: '',
                      })
                      setClassInfo(null)
                    }}
                  />
                </Tooltip>
              )}
            </Descriptions.Item>

            {classInfo?.course.status === 2 ? (
              <Descriptions.Item span={3} label="Class Status">
                <Badge status="success" text="Finished" />
              </Descriptions.Item>
            ) : (
              <>
                <Descriptions.Item span={3} label="Chapter No.">
                  {classInfo?.currentChapterInfo?.chapterNO}
                </Descriptions.Item>

                <Descriptions.Item span={3} label="Chapter Name">
                  {classInfo?.currentChapterInfo?.chapterName}
                </Descriptions.Item>

                <Descriptions.Item span={3} label="Chapter Content">
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
