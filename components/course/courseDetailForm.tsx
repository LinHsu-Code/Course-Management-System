import { Col, Form, Row, Button, Input, Select } from 'antd'
import { useEffect, useState } from 'react'
import { getCourseTypes, getTeachers } from '../../lib/request'
import { CourseType, OptionValue } from '../../lib/model'
import { ValidateMessages } from '../../lib/constants'
import DebouncedSearchSelect from '../common/debouncedSearchSelect'

async function fetchTeacherList(teacherName: string): Promise<OptionValue[]> {
  return getTeachers({ query: teacherName }).then((res) =>
    res.data.teachers.map((teacher) => ({
      label: teacher.name,
      value: teacher.id,
    }))
  )
}

export default function CourseDetailForm({}: {}) {
  const [teacherId, setTeacherId] = useState()
  const [courseTypes, setCourseTypes] = useState<CourseType[]>([])

  useEffect(() => {
    getCourseTypes().then((res) => {
      if (res.data) {
        setCourseTypes(res.data)
      }
    })
  }, [])
  return (
    <Form
      name="add_course"
      // onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      validateMessages={ValidateMessages}
      autoComplete="off"
      layout="vertical"
    >
      <Row gutter={[16, 24]}>
        <Col xs={12} md={6}>
          <Form.Item
            label="Course Name"
            name="name"
            rules={[{ required: true }, { max: 100, min: 3 }]}
          >
            <Input type="text" placeholder="course name" />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item
            label="Teacher"
            name="teacherId"
            rules={[{ required: true }]}
          >
            <DebouncedSearchSelect
              value={teacherId}
              placeholder="search and select teacher"
              fetchOptions={fetchTeacherList}
              onChange={(newValue) => {
                setTeacherId(newValue)
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select mode="multiple" placeholder="select course types">
              {courseTypes.map((courseType) => (
                <Select.Option key={courseType.id} value={courseType.id}>
                  {courseType.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          <Form.Item
            label="Course Code"
            name="uid"
            rules={[{ required: true }]}
          >
            <Input
              type="text"
              placeholder="course code"
              disabled
              //   addonAfter={
              //     isGenCodeDisplay ? (
              //       <KeyOutlined style={{ cursor: 'pointer' }} />
              //     ) : null
              //   }
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col xs={24} md={8}>
          21
        </Col>
        <Col xs={24} md={8}>
          22
        </Col>
        <Col xs={24} md={8}>
          23
        </Col>
      </Row>
      <Row>
        {' '}
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Row>
    </Form>
  )
}
