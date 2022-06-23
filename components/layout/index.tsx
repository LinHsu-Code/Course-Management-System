import { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { Layout, Menu, Row, Col, Avatar, Badge } from 'antd'
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BellOutlined,
  ProfileOutlined,
} from '@ant-design/icons'
import styles from './dashboard-layout.module.scss'
import { useRouter } from 'next/router'
import { logout } from '../../lib/request'
import { ROUTES } from '../../lib/constants'
import SideMenu from './sideMenu'
import { bfsOne, getUserInfo } from '../../lib/util'
import Breadcrumb from './breadcrumb'
import { Role } from '../../lib/model'
import MessageModal from './messageModal'
import MessageContext from '../../providers/messageContext'

const { Header, Content, Sider } = Layout

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
  const [modalVisible, setModalVisible] = useState(false)

  const userInfo = getUserInfo()

  const {
    state: { unread },
  } = useContext(MessageContext)

  const breadcrumbDate = nav
    ? page === '[id]'
      ? bfsOne(nav, detailForWhat)?.concat([{ path: '[id]', label: 'Detail' }])
      : bfsOne(nav, page)
    : null

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

            <Col onClick={() => setModalVisible(true)}>
              <Badge
                count={unread.notification + unread.message}
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
                  {userInfo.role !== 'manager' && (
                    <Menu.Item
                      key="54"
                      onClick={() => {
                        router.replace(
                          `/dashboard/${userInfo.role}/profile`,
                          undefined,
                          { shallow: true }
                        )
                      }}
                    >
                      <ProfileOutlined />
                      <span>Profile</span>
                    </Menu.Item>
                  )}
                  <Menu.Item
                    key="55"
                    onClick={() => {
                      logout().then((res) => {
                        if (res.data) {
                          localStorage.clear()
                          router.replace('/login', undefined, { shallow: true })
                        }
                      })
                    }}
                  >
                    <LogoutOutlined />
                    <span>Logout</span>
                  </Menu.Item>
                </Menu>
              )}
            </Col>
          </Row>

          <MessageModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
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
