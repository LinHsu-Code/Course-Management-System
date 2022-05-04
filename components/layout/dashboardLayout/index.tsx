import { useState } from 'react'
import Link from 'next/link'
import { Layout, Menu, Breadcrumb, Row, Col, Avatar } from 'antd'
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BellOutlined,
} from '@ant-design/icons'
import styles from './dashboard-layout.module.scss'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { logout } from '../../../lib/request'
import { useUserRole } from '../../custom-hooks'
import { ROUTES } from '../../../lib/constants'
import SideMenu from './sideMenu'
import { generateBreadcrumbData } from '../../../lib/util'

const { Header, Content, Sider } = Layout

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const paths = router.pathname.split('/')
  const rolePath = paths.slice(0, 3).join('/')
  const menuPaths = [rolePath, ...paths.slice(3)]
  const { id } = router.query
  const selectedKeys = [router.pathname]
  const openKeys = [
    `subMenuKey:${router.pathname.split('/').slice(0, 4).join('/')}`,
  ]
  const userRole = useUserRole()
  const userNav = ROUTES.get(userRole)
  const [collapsed, setCollapsed] = useState(false)
  const [logoutMenu, setLogoutMenu] = useState(false)

  const breadcrumbDate = userNav
    ? generateBreadcrumbData(menuPaths, userNav, id, userRole)
    : null

  const userLogout = async () => {
    const res = await logout()
    if (res.data) {
      localStorage.clear()
      router.replace('/login', undefined, { shallow: true })
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.replace('/login', undefined, { shallow: true })
    }
  }, [])

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

        {userNav && (
          <SideMenu
            userNav={userNav}
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

        <Breadcrumb className={styles.breadcrumb}>
          {breadcrumbDate &&
            breadcrumbDate.map((item) => (
              <Breadcrumb.Item key={item.href}>
                <a href={item.href}>{item.label}</a>
              </Breadcrumb.Item>
            ))}
        </Breadcrumb>

        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  )
}
