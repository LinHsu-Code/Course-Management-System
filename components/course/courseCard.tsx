/* eslint-disable @next/next/no-img-element */
import { Card, Row, Col, Divider } from 'antd'
import Link from 'next/link'
import { Course } from '../../lib/model'
import styles from './courseCard.module.scss'
import { HeartFilled, UserOutlined } from '@ant-design/icons'

export default function CourseCard({
  course,
  children,
}: {
  course: Course
  children: React.ReactNode
}) {
  return (
    <Card
      cover={
        <img
          alt="Course Image"
          src={course.cover}
          className={styles.coverImage}
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
            <Link href={`/dashboard/manager/teachers/${course.teacherId}`}>
              <a>
                <strong>{course.teacherName}</strong>
              </a>
            </Link>
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
// export default function CourseCard({ course }: { course: Course }) {
//   return (
//     <Card
//       cover={
//         <img
//           alt="Course Image"
//           src={course.cover}
//           className={styles.coverImage}
//         />
//       }
//     >
//       <div>
//         <Row>
//           <h3>{course.name}</h3>
//         </Row>
//         <Row className={styles.cardDescription}>
//           <Col>{course.startTime}</Col>
//           <Col>
//             <HeartFilled
//               style={{ marginRight: 5, fontSize: 16, color: 'red' }}
//             />
//             <strong>{course.star}</strong>
//           </Col>
//         </Row>
//         <Divider className={styles.cardDivider} />
//         <Row className={styles.cardDescription}>
//           <Col>Duration:</Col>
//           <Col>
//             <strong>{course.duration} years</strong>
//           </Col>
//         </Row>
//         <Divider className={styles.cardDivider} />
//         <Row className={styles.cardDescription} style={{ flexWrap: 'nowrap' }}>
//           <Col>Teacher:</Col>
//           <Col className={styles.cardInfo}>
//             <Link href={`/dashboard/manager/teachers/${course.teacherId}`}>
//               <a>
//                 <strong>{course.teacherName}</strong>
//               </a>
//             </Link>
//           </Col>
//         </Row>
//         <Divider className={styles.cardDivider} />
//         <Row className={styles.cardDescription}>
//           <Col>
//             <UserOutlined
//               style={{ marginRight: 5, fontSize: 16, color: '#1890ff' }}
//             />
//             Student Limit:
//           </Col>
//           <Col>
//             <strong>{course.maxStudents}</strong>
//           </Col>
//         </Row>
//         <Row>
//           <Link href={`/dashboard/manager/courses/${course.id}`} passHref>
//             <Button type="primary">Read More</Button>
//           </Link>
//         </Row>
//       </div>
//     </Card>
//   )
// }
