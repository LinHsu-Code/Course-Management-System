import { Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { ScheduleTime } from '../../lib/model'
import { Weekdays } from '../../lib/constants'

// const getClassTimes = (
//   weekdays: string[],
//   classTime: string[]
// ): ScheduleTime[] => {
//   const tableData= weekdays.reduce((pre, cur) => ({ ...pre, [cur ]: '' }), {})
//   classTime.forEach((item) => {
//     const arr = item.split(' ')
//     const weekday = arr[0]
//     const time = arr[1]
//     tableData[weekday] = time
//   })
//   console.log(tableData)
//   return [tableData]
// }

const getClassTimes = (
  weekdays: string[],
  classTime: string[]
): { [key: string]: string }[] => {
  const tableData: { [key: string]: string } = weekdays.reduce(
    (pre, cur) => ({ ...pre, [cur]: '' }),
    {}
  )
  classTime.forEach((item) => {
    const arr = item.split(' ')
    const weekday = arr[0]
    const time = arr[1]
    tableData[weekday] = time
  })
  tableData.key = '1'
  console.log(tableData)
  return [tableData]
}

const columns: ColumnType<{ [key: string]: string }>[] = Weekdays.map(
  (weekday, index) => {
    return { title: weekday, dataIndex: weekday, key: index }
  }
)
console.log(columns)

// const columns: ColumnType<ScheduleTime>[] = Weekdays.map((weekday) => {
//   return { title: weekday, dataIndex: weekday, key: weekday }
// })

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
