import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Layout, Menu, Row, Col, Avatar, Modal, Button, Tabs } from 'antd'
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BellOutlined,
} from '@ant-design/icons'
import styles from './dashboard-layout.module.scss'
import { useRouter } from 'next/router'
import { logout } from '../../lib/request'
import { ROUTES } from '../../lib/constants'
import SideMenu from './sideMenu'
import { bfsOne } from '../../lib/util'
import Breadcrumb from './breadcrumb'
import { Role } from '../../lib/model'

const { Header, Content, Sider } = Layout
const { TabPane } = Tabs

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const paths = router.pathname.split('/')
  const role = paths[2] as Role
  const rolePath = paths.slice(0, 3)
  const page = paths.slice(-1).toString()
  const detailForWhat = page === '[id]' ? paths.slice(-2, -1).toString() : ''
  const selectedKeys = [
    router.pathname.split('/').slice(-1)[0] === '[id]'
      ? router.pathname.split('/').slice(0, -1).join('/')
      : router.pathname,
  ]
  const nav = role ? ROUTES.get(role) : null
  const sideNav = nav ? nav[0].subNav : null
  const [collapsed, setCollapsed] = useState(false)
  const [logoutMenu, setLogoutMenu] = useState(false)
  const [openKeys, setOpenKeys] = useState<string[]>([])
  const [modal1Visible, setModal1Visible] = useState(false)

  const breadcrumbDate = nav
    ? page === '[id]'
      ? bfsOne(nav, detailForWhat)?.concat([{ path: '[id]', label: 'Detail' }])
      : bfsOne(nav, page)
    : null

  const userLogout = async () => {
    const res = await logout()
    if (res.data) {
      localStorage.clear()
      router.replace('/login', undefined, { shallow: true })
    }
  }

  useEffect(() => {
    setOpenKeys([router.pathname.split('/').slice(2, 4).toString()])
  }, [router.pathname])

  return (
    <Layout className={styles.layout}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={styles.side}
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
            setOpenKeys={setOpenKeys}
          />
        )}
      </Sider>

      <Layout className={styles.wholeRight} id="scrollableDiv">
        <Header className={styles.header}>
          <Row>
            <Col
              className={styles.trigger}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Col>

            <Col onClick={() => setModal1Visible(true)}>
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
          <Modal
            closable={false}
            style={{ top: 68, marginRight: 56, marginLeft: 'auto' }}
            visible={modal1Visible}
            onOk={() => setModal1Visible(false)}
            onCancel={() => setModal1Visible(false)}
            width={400}
            footer={[
              <Row key="footer" style={{ textAlign: 'center' }}>
                <Col span={12} style={{ borderRight: '1px solid #f0f0f0' }}>
                  <Button type="text">Mark all as read</Button>
                </Col>
                <Col span={12}>
                  <Button style={{ border: 'none' }}>View history</Button>
                </Col>
              </Row>,
            ]}
          >
            <Tabs defaultActiveKey="1" style={{ height: 500 }}>
              <TabPane tab={`notification(0)`} key="1">
                Content of Tab Pane 1
              </TabPane>
              <TabPane tab={`message(0)`} key="2">
                Content of Tab Pane 2
              </TabPane>
            </Tabs>
          </Modal>
        </Header>

        {breadcrumbDate && (
          <Breadcrumb breadcrumbDate={breadcrumbDate} rolePath={rolePath} />
        )}

        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  )
}
