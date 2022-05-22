import { Col, Form, Row, Button, Input, Select } from 'antd'
import { useEffect, useState } from 'react'
import { getTeachers } from '../../lib/request'
import { OptionValue } from '../../lib/model'
import { ValidateMessages } from '../../lib/constants'

import React from 'react'
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
  const [value, setValue] = React.useState([])
  console.log('value:', value)

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
              value={value}
              placeholder="search and select teacher"
              fetchOptions={fetchTeacherList}
              onChange={(newValue) => {
                setValue(newValue)
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={12} md={6}>
          3
        </Col>
        <Col xs={12} md={6}>
          4
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
