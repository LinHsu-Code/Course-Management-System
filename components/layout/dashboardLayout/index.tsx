import { useState } from 'react'
import Link from 'next/link'
import { Layout, Menu, Row, Col, Avatar } from 'antd'
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BellOutlined,
} from '@ant-design/icons'
import styles from './dashboard-layout.module.scss'
import { useRouter } from 'next/router'
import { logout } from '../../../lib/request'
import { ROUTES } from '../../../lib/constants'
import SideMenu from './sideMenu'
import { bfsOne } from '../../../lib/util'
import { useAuth, useRole } from '../../../hooks'
import BreadCrumb from './breadCrumb'

const { Header, Content, Sider } = Layout

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useAuth()
  const role = useRole()
  const router = useRouter()
  const paths = router.pathname.split('/')
  const rolePath = paths.slice(0, 3)
  const page = paths.slice(-1).toString()
  const selectedKeys = [
    router.pathname.split('/').slice(-1)[0] === '[id]'
      ? router.pathname.split('/').slice(0, -1).join('/')
      : router.pathname,
  ]
  const openKeys = [router.pathname.split('/').slice(3, 4).toString()]
  const nav = role ? ROUTES.get(role) : null
  const sideNav = nav ? nav[0].subNav : null
  const [collapsed, setCollapsed] = useState(false)
  const [logoutMenu, setLogoutMenu] = useState(false)

  const breadcrumbDate = nav ? bfsOne(nav, page) : null

  const userLogout = async () => {
    const res = await logout()
    if (res.data) {
      localStorage.clear()
      router.replace('/login', undefined, { shallow: true })
    }
  }

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          minHeight: '100vh',
        }}
      >
        <div className={styles.logoContainer}>
          <Link href={'/'}>
            <a>
              <span className={styles.logo}>CMS</span>
            </a>
          </Link>
        </div>

        {sideNav && (
          <SideMenu
            sideNav={sideNav}
            rolePath={rolePath}
            openKeys={openKeys}
            selectedKeys={selectedKeys}
          />
        )}
      </Sider>

      <Layout>
        <Header className={styles.header}>
          <Row>
            <Col
              className={styles.trigger}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Col>

            <Col>
              <Avatar icon={<BellOutlined />} className={styles.avatar} />
            </Col>

            <Col
              onMouseEnter={() => setLogoutMenu(true)}
              onMouseLeave={() => setLogoutMenu(false)}
            >
              <Avatar icon={<UserOutlined />} className={styles.avatar} />
              {logoutMenu && (
                <Menu className={styles.logoutMenu} theme="dark">
                  <Menu.Item key="55" onClick={userLogout}>
                    <LogoutOutlined />
                    <span>Logout</span>
                  </Menu.Item>
                </Menu>
              )}
            </Col>
          </Row>
        </Header>

        {breadcrumbDate && (
          <BreadCrumb breadcrumbDate={breadcrumbDate} rolePath={rolePath} />
        )}

        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  )
}
