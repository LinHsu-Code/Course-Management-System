import Head from 'next/head'
import { Col, Input, Row, Select, Tabs } from 'antd'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { Course, CourseSearchBy, OptionValue } from '../../../../../lib/model'
import CourseDetailForm from '../../../../../components/course/courseDetailForm'
import CourseScheduleForm from '../../../../../components/course/courseScheduleForm'
import { CourseSearchBySelect } from '../../../../../lib/constants'
import DebouncedSearchSelect from '../../../../../components/common/debouncedSearchSelect'
import { getCourses } from '../../../../../lib/request'

const { Option } = Select

export default function Page() {
  const [isSearching, setIsSearching] = useState(false)
  const [searchBy, setSearchBy] = useState<CourseSearchBy>('uid')
  const [searchResult, setSearchResult] = useState<Course[]>([])
  const [course, setCourse] = useState<Course>()

  const router = useRouter()

  async function fetchList(searchByValue: string): Promise<OptionValue[]> {
    return getCourses({ [searchBy]: searchByValue }).then((res) => {
      setSearchResult(res.data.courses)
      return res.data.courses.map((course) => ({
        label: course.name,
        value: course.id,
      }))
    })
  }

  return (
    <>
      <Head>
        <title>{'CMS DashBoard: Manager-Edit Course'}</title>
      </Head>
      <Row gutter={[16, 24]} style={{ paddingBottom: 16 }}>
        <Col span={12}>
          <Input.Group compact size="large" style={{ display: 'flex' }}>
            <Select
              defaultValue="uid"
              onChange={(value: CourseSearchBy) => setSearchBy(value)}
            >
              {CourseSearchBySelect.map((item) => (
                <Option value={item.value} key={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
            <DebouncedSearchSelect
              placeholder={`search and select by ${searchBy}`}
              fetchOptions={fetchList}
              onSelect={(id: number) => {
                const course = searchResult.find((item) => item.id === id)
                setCourse(course)
              }}
            />
          </Input.Group>
        </Col>
      </Row>

      <Tabs type="card" size="large" animated>
        <Tabs.TabPane key="course" tab="Course Detail">
          <CourseDetailForm course={course} />
        </Tabs.TabPane>

        <Tabs.TabPane key="chapter" tab="Course Schedule">
          <CourseScheduleForm
            courseId={course?.id}
            scheduleId={course?.scheduleId}
          />
        </Tabs.TabPane>
      </Tabs>
    </>
  )
}
