import Head from 'next/head'
import { Empty, Steps } from 'antd'
import { useState } from 'react'
import CourseDetailForm from '../../../../../components/course/courseDetailForm'
import CourseScheduleForm from '../../../../../components/course/courseScheduleForm'

const { Step } = Steps

function getDisabled(stepNumber: number, finishedSteps: number) {
  return stepNumber > finishedSteps ? true : false
}
export default function Page() {
  const [current, setCurrent] = useState(0)
  const [finishedSteps, setFinishedSteps] = useState(0)

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Manager-Add Course'}</title>
      </Head>

      <Steps
        type="navigation"
        current={current}
        onChange={(current) => setCurrent(current)}
        className="site-navigation-steps"
        style={{ marginBottom: 24 }}
      >
        <Step title="Course Detail" />
        <Step
          disabled={getDisabled(1, finishedSteps)}
          title="Course Schedule"
        />
        <Step disabled={getDisabled(2, finishedSteps)} title="Success" />
      </Steps>

      {(() => {
        switch (current) {
          case 0:
            return <CourseDetailForm />
          case 1:
            return <CourseScheduleForm />
          case 2:
            return <div>success!!</div>
          default:
            return <Empty />
        }
      })()}
    </>
  )
}
