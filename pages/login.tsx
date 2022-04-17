import type { ReactElement } from 'react'
import AuthLayout from '../components/authLayout'
import Head from 'next/head'
import { Row, Col, Form, Input, Button, Checkbox, Radio } from 'antd'
import styles from '../styles/auth.module.scss'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login } from '../lib/httpRequest'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Login() {
  const router = useRouter()

  const onFinish = async (values: any) => {
    const loginResult = await login(values)
    localStorage.setItem('role', loginResult.role)
    localStorage.setItem('token', loginResult.token)
    localStorage.setItem('userId', loginResult.userId)
    router.push('dashboard')
  }

  useEffect(() => {
    if (localStorage.getItem('user')) {
      router.push('dashboard')
    }
  }, [])

  return (
    <>
      <Head>
        <title>{'Course Management Assistant: Sign In'}</title>
      </Head>

      <div>
        <h1 className={styles.FormHeading}>COURSE MANAGEMENT ASSISTANT</h1>
        <Row justify="center">
          <Col md={8}>
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{
                remember: true,
                role: 'student',
              }}
              onFinish={onFinish}
              validateTrigger="onBlur"
            >
              <Form.Item name="role">
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
                    message: `'password' must be 4-16 characters`,
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
          </Col>
        </Row>
      </div>
    </>
  )
}

Login.getLayout = function getLayout(data: any, component: ReactElement) {
  return <AuthLayout>{component}</AuthLayout>
}

//export default Login
