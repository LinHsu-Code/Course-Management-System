import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highmaps'
import { useEffect, useState } from 'react'
import { Statistics } from '../../lib/model'

export default function Line({
  data,
}: {
  data: {
    student?: Statistics[] | null
    teacher?: Statistics[] | null
    course: Statistics[] | null
  }
}) {
  const [options, setOptions] = useState<any>({
    title: {
      text: '',
    },
    yAxis: {
      title: {
        text: 'Increment',
      },
    },
    xAxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
  })

  useEffect(() => {
    if (!data) {
      return
    }

    const series = Object.entries(data).map(([title, data]) => ({
      name: title,
      data: data
        ? data.reduce((acc, curr) => {
            acc[Number(curr.name.split('-')[1]) - 1] += curr.amount
            return acc
          }, new Array(12).fill(0))
        : new Array(12).fill(0),
    }))

    setOptions({
      series,
    })
  }, [data])

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    ></HighchartsReact>
  )
}
