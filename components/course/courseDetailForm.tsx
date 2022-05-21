import { Col, Form, Row, Button } from 'antd'

export default function CourseDetailForm({}: {}) {
  return (
    <Form
      name="add_course"
      // onFinish={onFinish}
      // onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Row gutter={[16, 24]}>
        <Col xs={12} md={6}>
          1
        </Col>
        <Col xs={12} md={6}>
          2
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
      {/* <Form.Item
      label="Username"
      name="username"
      rules={[{ required: true, message: 'Please input your username!' }]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
    </Form.Item>

    <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
      <Checkbox>Remember me</Checkbox>
    </Form.Item>

    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item> */}
    </Form>
  )
}
