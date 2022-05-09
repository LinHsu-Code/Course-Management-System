import { Menu } from 'antd'
import Link from 'next/link'
import { DynamicNav } from '../../../lib/model'

const renderSideMenu = (navData: DynamicNav[], parentPath: string[]) => {
  return navData.map((item: DynamicNav) => {
    const itemPath =
      parentPath.slice(-1)[0] === item.path
        ? parentPath
        : [...parentPath, item.path]
    const subMenuKey = itemPath.slice(3, 4).toString()
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
  userNav,
  rolePath,
  openKeys,
  selectedKeys,
}: {
  userNav: DynamicNav[]
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
      {renderSideMenu(userNav, rolePath)}
    </Menu>
  )
}
