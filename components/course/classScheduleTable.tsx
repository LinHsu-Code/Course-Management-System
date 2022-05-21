import { Table } from 'antd'
import { ColumnType } from 'antd/lib/table'
import { ScheduleTableData, Weekday } from '../../lib/model'
import { Weekdays } from '../../lib/constants'

const getClassTimes = (
  weekdays: Weekday[],
  classTime: string[]
): ScheduleTableData[] => {
  const tableData: ScheduleTableData = weekdays.reduce(
    (acc, cur) => ({ ...acc, [cur]: '' }),
    {} as ScheduleTableData
  )
  classTime.forEach((item) => {
    const arr = item.split(' ')
    const weekday = arr[0] as Weekday
    const time = arr[1]
    tableData[weekday] = time
  })
  tableData.key = '1'
  return [tableData]
}

const columns: ColumnType<ScheduleTableData>[] = Weekdays.map(
  (weekday, index) => {
    return { title: weekday, dataIndex: weekday, key: index }
  }
)

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
