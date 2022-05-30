import { Menu } from 'antd'
import Link from 'next/link'
import { DynamicNav } from '../../lib/model'

const renderSideMenu = (sideNav: DynamicNav[], parentPath: string[]) => {
  return sideNav.map((item: DynamicNav) => {
    const itemPath =
      parentPath.slice(-1)[0] === item.path || item.path === ''
        ? parentPath
        : [...parentPath, item.path]
    //subMenuKey role,first-level path eg:'manager, students'
    const subMenuKey = itemPath.slice(2, 4).toString()
    if (item.subNav && !!item.subNav.length) {
      return (
        <Menu.SubMenu key={subMenuKey} title={item.label} icon={item.icon}>
          {renderSideMenu(item.subNav, itemPath)}
        </Menu.SubMenu>
      )
    } else {
      return item.isHideInSiderNav ? null : (
        <Menu.Item key={itemPath.join('/')} icon={item.icon}>
          <Link href={itemPath.join('/')}>
            <a>{item.label}</a>
          </Link>
        </Menu.Item>
      )
    }
  })
}

export default function SideMenu({
  sideNav,
  rolePath,
  openKeys,
  selectedKeys,
}: {
  sideNav: DynamicNav[]
  rolePath: string[]
  openKeys: string[]
  selectedKeys: string[]
}) {
  return (
    <Menu
      theme="dark"
      mode="inline"
      defaultOpenKeys={openKeys}
      defaultSelectedKeys={selectedKeys}
      style={{ borderRight: 0 }}
    >
      {renderSideMenu(sideNav, rolePath)}
    </Menu>
  )
}
