import { useState } from 'react'
import Link from 'next/link'
import {
  Layout,
  Menu,
  Breadcrumb,
  PageHeader,
  Row,
  Col,
  Avatar,
  MenuProps,
} from 'antd'
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
import { DynamicNav } from '../../../lib/model'
import path from 'path/posix'
import Item from 'antd/lib/list/Item'

const { Header, Content, Sider } = Layout

{
  /* <Breadcrumb>
<Breadcrumb.Item>Home</Breadcrumb.Item>
<Breadcrumb.Item>
  <a href="">Application Center</a>
</Breadcrumb.Item>
<Breadcrumb.Item>
  <a href="">Application List</a>
</Breadcrumb.Item>
<Breadcrumb.Item>An Application</Breadcrumb.Item>
</Breadcrumb> */
}

const renderSideMenuItems = (navData: DynamicNav[], parentPath = '') => {
  return navData.map((item: DynamicNav) => {
    const itemPath = parentPath + item.path
    const subMenuKey = `subMenuKey:${itemPath}`
    if (item.subNav && !!item.subNav.length) {
      return (
        <Menu.SubMenu key={subMenuKey} title={item.label} icon={item.icon}>
          {renderSideMenuItems(item.subNav, itemPath)}
        </Menu.SubMenu>
      )
    } else {
      return item.isHideInSiderNav ? null : (
        <Menu.Item key={itemPath} icon={item.icon}>
          <Link href={itemPath} replace>
            <a>{item.label}</a>
          </Link>
        </Menu.Item>
      )
    }
  })
}

// const getNameFromPath = (path: string, navData: DynamicNav[]) => {
//   let result
//   navData.forEach((item) => {
//     if (!item.subNav) {
//       if (item.path === `/${path}`) {
//         result = (
//           <Breadcrumb.Item key={item.label}>
//             <a href={item.path}>{item.label}</a>
//           </Breadcrumb.Item>
//         )
//         return
//       }
//     } else {
//       if (item.path === `/${path}` && item.isHideInBreadcrumb) {
//         result = (
//           <Breadcrumb.Item key={item.label}>
//             <a href={item.path}>{item.subNav[0].label}</a>
//           </Breadcrumb.Item>
//         )
//         return
//       } else {
//         getNameFromPath(path, item.subNav)
//       }
//     }
//   })
//   return result
// }

const getNameFromPath = (
  path: string,
  navData: DynamicNav[],
  isLast: boolean
): string | undefined => {
  for (let i = 0; i < navData.length; i++) {
    if (navData[i].subNav === undefined) {
      if (navData[i].path === `/${path}`) {
        return navData[i].label
      }
      continue
    } else {
      if (navData[i].path === `/${path}`) {
        if (isLast) {
          return navData[i].subNav?.[0].label
        } else {
          return navData[i].label
        }
        continue
      } else {
        const result = getNameFromPath(path, navData[i].subNav, isLast)
        if (result) {
          return result
        }
        continue
      }
    }
  }
}

const generateBreadcrumbDate = (
  paths: string[],
  navData: DynamicNav[],
  id: string | string[] | undefined,
  userRole: string
): { href: string; label: string | undefined }[] => {
  const overviewPath = paths.slice(0, 3).join('/')
  let menuPaths = [overviewPath, ...paths.slice(3)]
  if (typeof id === 'string') {
    menuPaths = [...menuPaths.slice(0, menuPaths.length - 1), id]
  }
  console.log('menuPaths', menuPaths)

  return menuPaths.map((item, index, arr) => {
    const href = arr.slice(0, index + 1).join('/')
    if (/\d+/g.test(item)) {
      return { href, label: 'Detail' }
    } else if (item.indexOf(userRole) !== -1) {
      return { href, label: `CMS ${userRole.toUpperCase()} SYSTEM` }
    } else {
      return {
        href,
        label: getNameFromPath(item, navData, index === arr.length - 1),
      }
    }
  })
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const paths = router.pathname.split('/')
  const { id } = router.query

  //console.log(paths)
  const selectedKeys = [router.pathname]
  const openKeys = [
    `subMenuKey:${router.pathname.split('/').slice(0, 4).join('/')}`,
  ]
  const userRole = useUserRole()
  const userNav = ROUTES.get(userRole)
  //console.log(userNav)
  const [collapsed, setCollapsed] = useState(false)
  const [logoutMenu, setLogoutMenu] = useState(false)

  const breadcrumbDate = generateBreadcrumbDate(paths, userNav, id, userRole)
  console.log('breadcrumbDate=', breadcrumbDate)

  const toggle = () => {
    setCollapsed(!collapsed)
  }

  const userLogout = async () => {
    const res = await logout()
    if (res.data) {
      localStorage.clear()
      router.replace('/login', undefined, { shallow: true })
    }
  }

  const handleSideMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e)
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
        <div className={styles.logo}>
          <Link href={'/'}>
            <a>
              <span style={{ color: '#fff', cursor: 'pointer' }}>CMS</span>
            </a>
          </Link>
        </div>

        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={openKeys}
          defaultSelectedKeys={selectedKeys}
          style={{ borderRight: 0 }}
          onClick={handleSideMenuClick}
        >
          {userNav && renderSideMenuItems(userNav, '/dashboard/manager')}
        </Menu>
      </Sider>

      <Layout>
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Row>
            <Col
              className={styles.trigger}
              onClick={toggle}
              style={{ marginRight: 'auto' }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Col>

            <Col>
              <Avatar icon={<BellOutlined />} style={{ marginRight: 24 }} />
            </Col>

            <Col
              onMouseEnter={() => setLogoutMenu(true)}
              onMouseLeave={() => setLogoutMenu(false)}
            >
              <Avatar icon={<UserOutlined />} style={{ marginRight: 24 }} />
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

        <Breadcrumb style={{ padding: '16px 24px' }}>
          {breadcrumbDate.map((item) => (
            <Breadcrumb.Item key={item.href}>
              <a href={item.href}>{item.label}</a>
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>

        <Content
          className="site-layout-background"
          style={{
            padding: 24,
            margin: 24,
            marginTop: 0,
            backgroundColor: 'white',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}
