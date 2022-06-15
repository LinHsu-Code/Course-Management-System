import Highcharts, { Point } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { zip } from 'lodash'
import { useEffect, useState } from 'react'
import { Weekdays } from '../../lib/constants'
import { StatisticsWithClassTime } from '../../lib/model'

if (typeof Highcharts === 'object') {
  require('highcharts/modules/heatmap')(Highcharts)
  require('highcharts/modules/exporting')(Highcharts)
}

function getPointCategoryName(point: Point, dimension: 'x' | 'y') {
  const series = point.series
  const isY = dimension === 'y'
  const axis = series[isY ? 'yAxis' : 'xAxis']
  return axis.categories[point[dimension] as number]
}

export default function Heat({
  data,
  title,
}: {
  data: StatisticsWithClassTime[]
  title: string
}) {
  const [options, setOptions] = useState<any>({
    chart: {
      type: 'heatmap',
      plotBorderWidth: 1,
    },
    xAxis: {
      categories: [...Weekdays, '<b>TOTAL</b>'],
    },
    accessibility: {
      point: {
        descriptionFormatter: (point: Point) => {
          const xName = getPointCategoryName(point, 'x')
          const yName = getPointCategoryName(point, 'y')
          const ix = point.index + 1
          const val = point.value
          return ix + '. ' + xName + ' lessons ' + yName + ', ' + val + '.'
        },
      },
    },
    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
      maxColor: '#1890ff',
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        return `<b> ${getPointCategoryName((this as any).point, 'y')}</b>
             <br/>
             <b>${
               (this as any).point.value
             }</b> lessons on <b>${getPointCategoryName(
          (this as any).point,
          'x'
        )}</b>`
      },
    },
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 500,
          },
          chartOptions: {
            yAxis: {
              labels: {
                formatter: function () {
                  //console.log(this)
                  //return (this as any).value.charAt(0)
                  return (this as any).value.toString().charAt(0)
                },
              },
            },
          },
        },
      ],
    },
    credits: {
      enabled: false,
    },
  })

  useEffect(() => {
    const yCategories = data.map((item) => item.name).concat(`<b>TOTAL</b>`)
    console.log('data:', data)
    const rowData = data.map((item) => {
      const ary = new Array(7).fill(0)
      const courses = item.courses
        .map((course) => course.classTime)
        .flat()
        .map((item) => item?.split(' ')[0])
      courses.forEach((weekday) => {
        const index = Weekdays.findIndex((item) => item === weekday)

        ary[index] += 1
      })
      return ary.concat(ary.reduce((acc, cur) => acc + cur))
    })
    console.log('rowData:', rowData)
    console.log('rowData zip:', zip(...rowData))
    console.log(
      'rowData before flat:',
      zip(...rowData).map((columnAry, index) => {
        const len = columnAry.length
        const result = []
        let i = 0
        for (i = 0; i < len; i++) {
          result.push([index, i, columnAry[i]])
        }
        result.push([index, i, result.reduce((acc, cur) => acc + cur[2], 0)])
        return result
      })
    )
    const sourceData = zip(...rowData)
      .map((columnAry, index) => {
        const len = columnAry.length
        const result = []
        let i = 0
        for (i = 0; i < len; i++) {
          result.push([index, i, columnAry[i]])
        }
        result.push([index, i, result.reduce((acc, cur) => acc + cur[2], 0)])
        return result
      })
      .flat()

    console.log('sourceData:', sourceData)

    setOptions({
      title: {
        text: `<span style="text-transform: capitalize">${title}</span>`,
      },
      yAxis: {
        categories: yCategories,
        title: null,
        reversed: true,
      },
      series: [
        {
          borderWidth: 1,
          data: sourceData,
          dataLabels: {
            enabled: true,
            color: '#000000',
          },
        },
      ],
    })
  }, [data, title])

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    ></HighchartsReact>
  )
}
