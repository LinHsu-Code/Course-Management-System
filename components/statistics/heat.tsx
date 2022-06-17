import Highcharts, { Point } from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { zip } from 'lodash'
import { useEffect, useState } from 'react'
import { Weekdays, WeekdaysToIndex } from '../../lib/constants'
import { StatisticsWithClassTime, Weekday } from '../../lib/model'

if (typeof Highcharts === 'object') {
  require('highcharts/modules/heatmap')(Highcharts)
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
      categories: Weekdays,
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
    const yCategories = data.map((item) => item.name)

    var init = Array(data.length)
      .fill(0)
      .map(() => Array(7).fill(0))

    const twoDimensionalHeatData = data.reduce((acc, curr, i) => {
      acc[i] = new Array(7).fill(0)
      curr.courses.forEach((course) => {
        course.classTime?.forEach((classTime) => {
          const j = WeekdaysToIndex[classTime.split(' ')[0] as Weekday]
          acc[i][j]++
        })
      })
      return acc
    }, init)

    const HeatDataWithIndex: number[][] = []
    zip(...twoDimensionalHeatData).forEach((item, i) => {
      item.forEach((n, j) => {
        HeatDataWithIndex.push([i, j, n as number])
      })
    })

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
          data: HeatDataWithIndex,
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
