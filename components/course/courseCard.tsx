/* eslint-disable @next/next/no-img-element */
import { Card, Row, Col, Divider } from 'antd'
import Link from 'next/link'
import { Course } from '../../lib/model'
import styles from './courseCard.module.scss'
import { HeartFilled, UserOutlined } from '@ant-design/icons'
import { useUserInfo } from '../../hooks/user'

export default function CourseCard({
  course,
  children,
}: {
  course: Course
  children: React.ReactNode
}) {
  const userInfo = useUserInfo()

  return (
    <Card
      cover={
        <img
          alt="Course Image"
          // src={course.cover}
          src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
          className={styles.coverImage}
          style={{
            backgroundColor: '#eee',
          }}
        />
      }
    >
      <div>
        <Row>
          <h3>{course.name}</h3>
        </Row>

        <Row className={styles.cardDescription}>
          <Col>{course.startTime}</Col>
          <Col>
            <HeartFilled
              style={{ marginRight: 5, fontSize: 16, color: 'red' }}
            />
            <strong>{course.star}</strong>
          </Col>
        </Row>

        <Divider className={styles.cardDivider} />

        <Row className={styles.cardDescription}>
          <Col>Duration:</Col>
          <Col>
            <strong>{course.duration} years</strong>
          </Col>
        </Row>

        <Divider className={styles.cardDivider} />

        <Row className={styles.cardDescription} style={{ flexWrap: 'nowrap' }}>
          <Col>Teacher:</Col>
          <Col className={styles.cardInfo}>
            {userInfo.role === 'manager' ? (
              <Link
                href={`/dashboard/${userInfo.role}/teachers/${course.teacherId}`}
              >
                <a>
                  <strong>{course.teacherName}</strong>
                </a>
              </Link>
            ) : (
              <strong>{course.teacherName}</strong>
            )}
          </Col>
        </Row>

        <Divider className={styles.cardDivider} />

        <Row className={styles.cardDescription}>
          <Col>
            <UserOutlined
              style={{ marginRight: 5, fontSize: 16, color: '#1890ff' }}
            />
            Student Limit:
          </Col>
          <Col>
            <strong>{course.maxStudents}</strong>
          </Col>
        </Row>

        {children}
      </div>
    </Card>
  )
}
