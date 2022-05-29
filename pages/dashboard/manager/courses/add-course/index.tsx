import Head from 'next/head'
import { Steps, Result, Button } from 'antd'
import { useState } from 'react'
import { Course } from '../../../../../lib/model'
import CourseDetailForm from '../../../../../components/course/courseDetailForm'
import CourseScheduleForm from '../../../../../components/course/courseScheduleForm'
import { useRouter } from 'next/router'

const { Step } = Steps

function getDisabled(
  stepNumber: number,
  current: number,
  finishedSteps: number
) {
  //return false
  return stepNumber > Math.max(finishedSteps + 1, current) ? true : false
}

export default function Page() {
  const [current, setCurrent] = useState(0)
  const [finishedSteps, setFinishedSteps] = useState(-1)
  const [course, setCourse] = useState<Course | null>(null)

  const router = useRouter()

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
          course={course}
          afterSuccess={(course: Course) => {
            setCourse(course)
            setCurrent(1)
            setFinishedSteps(0)
          }}
        />
      </div>

      <div style={{ display: current === 1 ? 'block' : 'none' }}>
        <CourseScheduleForm
          course={course}
          afterSuccess={() => {
            setCurrent(2)
            setFinishedSteps(1)
          }}
        />
      </div>

      <div style={{ display: current === 2 ? 'block' : 'none' }}>
        <Result
          status="success"
          title="Successfully Create Course!"
          extra={[
            <Button
              type="primary"
              key="detail"
              onClick={() =>
                router.push(`/dashboard/manager/courses/${course?.id}`)
              }
            >
              Go Course
            </Button>,
            <Button
              key="again"
              onClick={() => {
                router.reload()
              }}
            >
              Create Again
            </Button>,
          ]}
        />
      </div>
    </>
  )
}
