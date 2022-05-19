import { Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { ScheduleTime } from '../../lib/model'
import { Weekdays } from '../../lib/constants'

const getClassTimes = (
  weekdays: string[],
  classTime: string[]
): ScheduleTime[] => {
  const tableData = weekdays.reduce((pre, cur) => ({ ...pre, [cur]: '' }), {})
  classTime.forEach((item) => {
    const arr = item.split(' ')
    const weekday = arr[0]
    const time = arr[1]
    tableData[weekday] = time
  })
  console.log(tableData)
  return [tableData]
}

export default function CourseCard({ classTime }: { classTime: string[] }) {
  const columns: ColumnType<ScheduleTime>[] = Weekdays.map((weekday) => {
    return { title: weekday, dataIndex: weekday, key: weekday }
  })

  return (
    <Table
      rowKey="id"
      bordered
      size="small"
      pagination={false}
      columns={columns}
      dataSource={getClassTimes(Weekdays, classTime)}
    />
  )
}
