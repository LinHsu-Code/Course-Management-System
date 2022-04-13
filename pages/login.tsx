import type { NextPage } from 'next'
import Head from 'next/head'
import { Row, Col, Form, Input, Button, Checkbox, Radio } from 'antd'
import styles from '../styles/auth.module.scss'
import { UserOutlined, LockOutlined } from '@ant-design/icons'

const Login: NextPage = () => {
  const onFinish = (values: any) => {
    console.log('Received values of form: ', values)
  }

  return (
    <>
      <Head>
        <title>{'Sign In'}</title>
      </Head>

      <Row justify="center">
        <Col md={8}>
          <div className={styles.FormHeading}>
            <h1>Sign In</h1>
          </div>

          <div className={styles.FormBody}>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
                role: 'student',
              }}
              onFinish={onFinish}
            >
              <Form.Item
                name="role"
                rules={[
                  {
                    message: 'Please pick an item!',
                  },
                ]}
              >
                <Radio.Group>
                  <Radio.Button value="student">Student</Radio.Button>
                  <Radio.Button value="teacher">Teacher</Radio.Button>
                  <Radio.Button value="manager">Manager</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                  },
                  {
                    type: 'email',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  type="email"
                  placeholder="Please input email"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                  },
                  {
                    min: 4,
                    max: 16,
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Please input password"
                />
              </Form.Item>

              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  Log in
                </Button>
                No account? <a href="">register now!</a>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  )
}

export default Login
