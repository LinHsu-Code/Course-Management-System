import { useState } from 'react'
import { Layout, Menu, PageHeader, Row, Col, Avatar } from 'antd'
import Link from 'next/link'
import {
  LogoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  BellOutlined,
  DashboardOutlined,
  SolutionOutlined,
  TeamOutlined,
  DeploymentUnitOutlined,
  ReadOutlined,
  ProjectOutlined,
  FileAddOutlined,
  EditOutlined,
  MessageOutlined,
} from '@ant-design/icons'
import styles from './dashboard-layout.module.scss'
import { useRouter } from 'next/router'
import { logout } from '../lib/httpRequest'
const { SubMenu } = Menu
const { Header, Content, Sider } = Layout
const routes = [
  {
    path: '/',
    breadcrumbName: 'CMS MANAGER SYSTEM',
  },
  {
    path: 'manager',
    breadcrumbName: 'Overview',
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const [logoutMenu, setLogoutMenu] = useState(false)

  const toggle = () => {
    setCollapsed(!collapsed)
  }

  const showLogoutMenu = () => {
    setLogoutMenu(!logoutMenu)
  }
  const userLogout = async () => {
    await logout()
    router.push('login')
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
        <div className={styles.logo} />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['0']}
          style={{ height: '100%', borderRight: 0 }}
        >
          <Menu.Item key="0" icon={<DashboardOutlined />}>
            Overview
          </Menu.Item>
          <SubMenu key="sub1" icon={<SolutionOutlined />} title="Student">
            <Menu.Item key="1" icon={<TeamOutlined />}>
              Student List
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<DeploymentUnitOutlined />} title="Teacher">
            <Menu.Item key="5" icon={<TeamOutlined />}>
              Teacher List
            </Menu.Item>
          </SubMenu>
          <SubMenu key="sub3" icon={<ReadOutlined />} title="Course">
            <Menu.Item key="9" icon={<ProjectOutlined />}>
              All Course
            </Menu.Item>
            <Menu.Item key="10" icon={<FileAddOutlined />}>
              Add Course
            </Menu.Item>
            <Menu.Item key="11" icon={<EditOutlined />}>
              Edit Course
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="12" icon={<MessageOutlined />}>
            Message
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Col className={styles.trigger} onClick={toggle}>
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Col>
            <Col>
              <Avatar icon={<BellOutlined />} style={{ marginRight: 24 }} />
              <span onMouseEnter={showLogoutMenu} onMouseLeave={showLogoutMenu}>
                <Avatar icon={<UserOutlined />} style={{ marginRight: 24 }} />
              </span>
            </Col>
          </Row>
        </Header>
        {logoutMenu && (
          <Menu className={styles.logoutMenu} theme="dark">
            <Menu.Item key="55" onClick={userLogout}>
              <LogoutOutlined />
              <span>Logout</span>
            </Menu.Item>
          </Menu>
        )}
        <PageHeader className="site-page-header" breadcrumb={{ routes }} />
        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 24,
            marginTop: 0,
            backgroundColor: 'white',
          }}
        >
          Content
        </Content>
      </Layout>
    </Layout>
  )
}
// #components-layout-demo-top-side-2 .logo {
//   float: left;
//   width: 120px;
//   height: 31px;
//   margin: 16px 24px 16px 0;
//   background: rgba(255, 255, 255, 0.3);
// }

// .ant-row-rtl #components-layout-demo-top-side-2 .logo {
//   float: right;
//   margin: 16px 0 16px 24px;
// }

// .site-layout-background {
//   background: #fff;
// }
