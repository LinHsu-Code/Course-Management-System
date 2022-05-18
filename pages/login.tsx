import Link from 'next/link'
import Head from 'next/head'
import { Layout, Row, Col, Form, Input, Button, Checkbox, Radio } from 'antd'
import styles from '../styles/auth.module.scss'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login } from '../lib/request'
import { useRouter } from 'next/router'
import { useUser } from '../hooks'
const { Header, Footer, Content } = Layout

export default function Page() {
  useUser()
  const router = useRouter()

  const onFinish = async (values: any) => {
    const res = await login(values)
    if (res.data) {
      const { token, role, userId } = res.data
      localStorage.setItem('role', role)
      localStorage.setItem('token', token)
      localStorage.setItem('userId', userId)
      router.replace(`/dashboard/${role}`, undefined, { shallow: true })
    }
  }

  return (
    <Layout className={styles.container}>
      <Head>
        <title>{'Course Management Assistant: Sign In'}</title>
      </Head>

      <Header>
        {' '}
        <Link href={`/`}>
          <a>Home</a>
        </Link>
        <span> </span>
        <Link href={`/login`}>
          <a>Sign In</a>
        </Link>
        <span> </span>
        <Link href={`/register`}>
          <a>Sign up</a>
        </Link>
      </Header>

      <Content className={styles.main}>
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
      </Content>

      <Footer className={styles.footer}>Footer</Footer>
    </Layout>
  )
}
