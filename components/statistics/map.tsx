import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highmaps'
import { useEffect, useState } from 'react'
import { Statistics } from '../../lib/model'
import { getWorldMap } from '../../lib/request'

export default function Map({
  data,
  title,
}: {
  data: Statistics[] | null
  title: string
}) {
  const [worldMap, setWorldMap] = useState<any>(null)
  const [options, setOptions] = useState<any>({
    colorAxis: {
      min: 0,
      stops: [
        [0, '#fff'],
        [1, '#1890ff'],
      ],
    },
    legend: {
      layout: 'vertical',
      align: 'left',
      verticalAlign: 'bottom',
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: true,
    },
  })

  useEffect(() => {
    getWorldMap().then((res) => {
      setWorldMap(res.data)
      console.log(res)
    })
  }, [])

  useEffect(() => {
    if (!data || !worldMap) {
      return
    }
    const mapData = data.map((item) => {
      const target = worldMap.features.find(
        (feature: any) =>
          item.name.toLowerCase() === feature.properties.name.toLowerCase()
      )
      return !!target
        ? {
            'hc-key': target.properties['hc-key'],
            value: item.amount,
          }
        : {}
    })
    const options = {
      title: {
        text: title.split('').join(' ').toUpperCase(),
      },
      series: [
        {
          data: mapData,
          mapData: worldMap,
          name: 'Total',
          states: {
            hover: {
              color: '#a4edba',
            },
          },
        },
      ],
    }
    setOptions(options)
  }, [data, title, worldMap])

  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType={'mapChart'}
      options={options}
    ></HighchartsReact>
  )
}
