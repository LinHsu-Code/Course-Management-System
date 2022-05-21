import { Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { ScheduleTime, Weekday } from '../../lib/model'
import { Weekdays } from '../../lib/constants'

const getClassTimes = (
  weekdays: Weekday[],
  classTime: string[]
): ScheduleTime[] => {
  const tableData: ScheduleTime = weekdays.reduce(
    (acc, cur) => ({ ...acc, [cur]: '' }),
    {} as ScheduleTime
  )
  classTime.forEach((item) => {
    const arr = item.split(' ')
    const weekday = arr[0] as Weekday
    const time = arr[1]
    tableData[weekday] = time
  })
  console.log(tableData)
  return [tableData]
}

const columns: ColumnType<ScheduleTime>[] = Weekdays.map((weekday, index) => {
  return { title: weekday, dataIndex: weekday, key: index }
})

export default function CourseCard({ classTime }: { classTime: string[] }) {
  return (
    <Table
      bordered
      size="small"
      pagination={false}
      columns={columns}
      dataSource={getClassTimes(Weekdays, classTime)}
      style={{ overflowX: 'hidden' }}
    />
  )
}
