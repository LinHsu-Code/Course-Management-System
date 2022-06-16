import Head from 'next/head'
import { Badge, Calendar, Card } from 'antd'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import { CourseWithSchedule } from '../../../../lib/model'
import { getClassSchedule } from '../../../../lib/request'

const getListData = (value) => {
  let listData

  switch (value.date()) {
    case 8:
      listData = [
        {
          type: 'warning',
          content: 'This is warning event.',
        },
        {
          type: 'success',
          content: 'This is usual event.',
        },
      ]
      break

    case 10:
      listData = [
        {
          type: 'warning',
          content: 'This is warning event.',
        },
        {
          type: 'success',
          content: 'This is usual event.',
        },
        {
          type: 'error',
          content: 'This is error event.',
        },
      ]
      break

    case 15:
      listData = [
        {
          type: 'warning',
          content: 'This is warning event',
        },
        {
          type: 'success',
          content: 'This is very long usual event。。....',
        },
        {
          type: 'error',
          content: 'This is error event 1.',
        },
        {
          type: 'error',
          content: 'This is error event 2.',
        },
        {
          type: 'error',
          content: 'This is error event 3.',
        },
        {
          type: 'error',
          content: 'This is error event 4.',
        },
      ]
      break

    default:
  }

  return listData || []
}

const getMonthData = (value) => {
  if (value.month() === 8) {
    return 1394
  }
}

export default function Page() {
  const [classSchedule, setClassSchedule] = useState<
    CourseWithSchedule[] | null
  >(null)

  useEffect(() => {
    const userId = Number(localStorage.getItem('userId'))
    getClassSchedule({ userId }).then((res) => {
      if (res.data) {
        setClassSchedule(res.data)
        console.log(res.data)
      }
    })
  }, [])

  const monthCellRender = (value) => {
    //console.log('month value:', value)
    const num = getMonthData(value)
    return num ? (
      <div className={styles.notesMonth}>
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null
  }

  const dateCellRender = (value) => {
    //console.log('date value:', value)
    const listData = getListData(value)
    return (
      <ul className={styles.events}>
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
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
      </div>
    </>
  )
}
