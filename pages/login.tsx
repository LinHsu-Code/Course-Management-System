import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import CustomLayout, { siteTitle } from '../components/customLayout'
//import styles from '../styles/Home.module.css'
import { Row, Col, Form, Input, Button, Checkbox, Radio } from 'antd'
import styles from '../styles/auth.module.scss'
import {
  UserOutlined,
  LockOutlined,
  RotateLeftOutlined,
} from '@ant-design/icons'
import React, { useState } from 'react'

const Login: NextPage = () => {
  const [role, setRole] = useState('student')
  // const onFinish = (values) => {
  //   console.log('Received values of form: ', values)
  // }
  const onRoleChange = ({ roleValue }: { roleValue: string }) => {
    setRole(roleValue)
  }

  return (
    <CustomLayout>
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
                roleValue: role,
              }}
              // onFinish={onFinish}
              onValuesChange={onRoleChange}
            >
              <Form.Item
                name="roleValue"
                // label="Role: "
                rules={[
                  {
                    //required: true,
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
                name="username"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Username!',
                  },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Please input your Password!',
                  },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <a className="login-form-forgot" href="">
                  Forgot password
                </a>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  //className={styles.FormButton}
                >
                  Log in
                </Button>
                No account? <a href="">register now!</a>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </CustomLayout>
  )
}

export default Login
