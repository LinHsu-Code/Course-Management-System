import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts/highmaps'
import { useEffect, useState } from 'react'
import { Statistics, StatisticsWithSkill } from '../../lib/model'
import { uniq } from 'lodash'
import { SkillLevels } from '../../lib/constants'

export default function Bar({
  studentInterests,
  teacherSkills,
}: {
  studentInterests: Statistics[]
  teacherSkills: {
    [key: string]: StatisticsWithSkill[]
  }
}) {
  const [options, setOptions] = useState<any>({
    chart: {
      type: 'column',
    },
    title: {
      text: 'Student VS Teacher',
    },
    subtitle: {
      text: `Comparing what students are interested in and teachers' skills`,
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Interests VS Skills',
      },
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },

    tooltip: {
      formatter: function () {
        return (this as any).series.name === 'Interest'
          ? `${(this as any).series.name}: ${(this as any).y}`
          : `<b>${(this as any).x}</b><br/>${(this as any).series.name}: ${
              (this as any).y
            }<br/>total: ${(this as any).point.stackTotal}`
      },
    },

    plotOptions: {
      column: {
        stacking: 'normal',
        // dataLabels: {
        //   enabled: true,
        // },
      },
    },
    exporting: {
      enabled: false,
    },
  })

  useEffect(() => {
    const categories: string[] = uniq([
      ...studentInterests.map(({ name }) => name),
      ...Object.keys(teacherSkills),
    ])

    const interestSeries = {
      name: 'Interest',
      stack: 'interest',
      data: categories.map(
        (language) =>
          studentInterests.find((item) => item.name === language)?.amount || 0
      ),
    }

    const skillSeries = SkillLevels.map((level, index) => ({
      name: level,
      stack: 'teacher',
      data: categories.map(
        (language) =>
          teacherSkills[language]?.find((item) => item.level === index + 1)
            ?.amount || 0
      ),
    }))

    setOptions({
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45,
          style: {
            fontSize: '13px',
            fontFamily: 'Verdana, sans-serif',
          },
        },
        categories: categories,
      },
      series: [interestSeries, ...skillSeries],
    })
  }, [studentInterests, teacherSkills])

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
    ></HighchartsReact>
  )
}
