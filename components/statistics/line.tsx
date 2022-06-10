import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highmaps'
import { useEffect, useRef, useState } from 'react'
import { Statistics } from '../../lib/model'

export default function Line({
  data,
}: {
  data: {
    student: Statistics[] | null
    teacher: Statistics[] | null
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
  const charRef = useRef(null)

  //   useEffect(() => {
  //     const { chart } = charRef.current
  //     const timer = setTimeout(() => {
  //       chart.reflow()
  //     }, 30)

  //     return () => {
  //       clearTimeout(timer)
  //     }
  //   }, [])

  useEffect(() => {
    if (!data) {
      return
    }
    const series = Object.entries(data)
      .filter(([_, data]) => !!data && !!data.length)
      .map(([title, data]) => ({
        name: title,
        data: new Array(12).fill(0).map((_, index) => {
          const month = index + 1
          const name = month > 9 ? month + '' : '0' + month
          const target = data
            ? data.find((item) => item.name.split('-')[1] === name)
            : null
          return (target && target.amount) || 0
        }),
      }))

    setOptions({
      series,
    })
  }, [data])

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={charRef}
    ></HighchartsReact>
  )
}
