/* eslint-disable @next/next/no-img-element */
import { Card, Row, Badge, Collapse, Steps, Tag } from 'antd'
import { CourseDetail } from '../../lib/model'
import { CourseStatusColor, CourseStatusText } from '../../lib/constants'
import ClassScheduleTable from './classScheduleTable'
import styles from './courseDetailCard.module.scss'

const genExtra = (source: Schedule, index: number) => {
  const currentIndex = source.chapters.findIndex(
    (item) => item.id === source.current
  )
  const status = index === currentIndex ? 1 : index < currentIndex ? 2 : 0

  return <Tag color={CourseStatusColor[status]}>{CourseStatusText[status]}</Tag>
}

export default function CourseDetailCard({ course }: { course: CourseDetail }) {
  return (
    <Card className={styles.courseDetailCard}>
      <h2>Course Detail</h2>

      <h3>Create Time</h3>
      <Row>{course.createdAt}</Row>

      <h3>Start Time</h3>
      <Row>{course.startTime}</Row>

      <Badge color={CourseStatusColor[course.status]} dot offset={[5, 18]}>
        <h3>Status{course.status}</h3>
      </Badge>

      <div className={styles.stepsContainer}>
        <Steps
          size="small"
          current={course.schedule.chapters.findIndex(
            (item) => item.id === course.schedule.current
          )}
          className={styles.steps}
        >
          {course.schedule.chapters.map((item) => (
            <Steps.Step
              title={item.name}
              key={item.id}
              className={styles.step}
            />
          ))}
        </Steps>
      </div>

      <h3>Course Code</h3>
      <Row>{course.uid}</Row>

      <h3>Class Time</h3>

      <ClassScheduleTable classTime={course.schedule.classTime} />

      <h3>Category</h3>
      <Row>
        {course.type.map((item) => (
          <Tag color={'geekblue'} key={item.id}>
            {item.name}
          </Tag>
        ))}
      </Row>

      <h3>Description</h3>
      <Row>{course.detail}</Row>

      <h3>Chapter</h3>
      {course.schedule && (
        <Collapse defaultActiveKey={course.schedule.current}>
          {course.schedule.chapters.map((item, index) => (
            <Collapse.Panel
              header={item.name}
              key={item.id}
              extra={genExtra(course.schedule, index)}
            >
              <p>{item.content}</p>
            </Collapse.Panel>
          ))}
        </Collapse>
      )}
    </Card>
  )
}
