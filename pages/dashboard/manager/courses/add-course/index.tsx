import Head from 'next/head'
import { Empty, Steps } from 'antd'
import { useState } from 'react'
import { Course } from '../../../../../lib/model'
import CourseDetailForm from '../../../../../components/course/courseDetailForm'
import CourseScheduleForm from '../../../../../components/course/courseScheduleForm'

const { Step } = Steps

function getDisabled(
  stepNumber: number,
  current: number,
  finishedSteps: number
) {
  return false
  // return stepNumber > Math.max(finishedSteps, current) ? true : false
}
export default function Page() {
  const [current, setCurrent] = useState(0)
  const [finishedSteps, setFinishedSteps] = useState(-1)
  const [courseId, setCourseId] = useState<number>(0)
  const [scheduleId, setScheduleId] = useState<number>(0)
  // const moveToNextStep = () => {
  //   setStep(step + 1);
  //   setAvailableNavigate([...availableNavigate, step + 1]);
  // };

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
          disabled={getDisabled(1, current, finishedSteps)}
          title="Course Schedule"
        />
        <Step
          disabled={getDisabled(2, current, finishedSteps)}
          title="Success"
        />
      </Steps>

      <div style={{ display: current === 0 ? 'block' : 'none' }}>
        <CourseDetailForm
          afterAddSuccess={(course: Course) => {
            setCourseId(course.id)
            setScheduleId(course.scheduleId)
            setCurrent(1)
            setFinishedSteps(0)
          }}
        />
      </div>

      <div style={{ display: current === 1 ? 'block' : 'none' }}>
        <CourseScheduleForm
          courseId={courseId}
          scheduleId={scheduleId}
          afterUpdateScheduleSuccess={() => {
            setCurrent(2)
            setFinishedSteps(1)
          }}
        />
      </div>

      <div style={{ display: current === 2 ? 'block' : 'none' }}>success!!</div>
    </>
  )
}
