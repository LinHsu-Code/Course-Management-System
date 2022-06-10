import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highmaps'
import { useEffect, useState } from 'react'
import { Statistics } from '../../lib/model'

export default function Pie({
  data,
  title,
}: {
  data: Statistics[] | null
  title: string
}) {
  const [options, setOptions] = useState<any>({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    tooltip: {
      pointFormat:
        '{series.name}: <b>{point.percentage:.1f}%</b> <br> total: {point.y}',
    },
    accessibility: {
      point: {
        valueSuffix: '%',
      },
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
        },
      },
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

    const source = data.map((item) => ({ name: item.name, y: item.amount }))

    setOptions({
      title: {
        text: title.split('_').join(' ').toUpperCase(),
      },
      subtitle: {
        text: `${title.split('_')[0]} total: ${source.reduce(
          (acc, cur) => acc + cur.y,
          0
        )}`,
        align: 'right',
      },
      series: [
        {
          name: 'percentage',
          colorByPoint: true,
          data: source,
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
