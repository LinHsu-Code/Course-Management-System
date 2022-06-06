import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import Link from 'next/link'
import { Layout, Menu, Row, Col, Avatar, Badge } from 'antd'
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
import { MessageCount, Role } from '../../lib/model'
import MessageModal from './messageModal'

const { Header, Content, Sider } = Layout

export default function DashboardLayout({
  children,
  unReadCount,
  setUnReadCount,
}: {
  children: React.ReactNode
  unReadCount: MessageCount
  setUnReadCount: Dispatch<SetStateAction<MessageCount>>
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
              <Badge
                count={unReadCount.message + unReadCount.notification}
                offset={[-30, 18]}
                size="small"
              >
                <BellOutlined className={styles.messageBell} />
              </Badge>
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

          <MessageModal
            modal1Visible={modal1Visible}
            setModal1Visible={setModal1Visible}
            unReadCount={unReadCount}
            setUnReadCount={setUnReadCount}
          />
        </Header>

        {breadcrumbDate && (
          <Breadcrumb breadcrumbDate={breadcrumbDate} rolePath={rolePath} />
        )}

        <Content className={styles.content}>{children}</Content>
      </Layout>
    </Layout>
  )
}
