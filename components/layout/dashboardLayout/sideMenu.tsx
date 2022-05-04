import { Menu } from 'antd'
import Link from 'next/link'
import { DynamicNav } from '../../../lib/model'

const renderSideMenu = (navData: DynamicNav[], parentPath = '') => {
  return navData.map((item: DynamicNav) => {
    const itemPath = parentPath + item.path
    const subMenuKey = `subMenuKey:${itemPath}`
    if (item.subNav && !!item.subNav.length) {
      return (
        <Menu.SubMenu key={subMenuKey} title={item.label} icon={item.icon}>
          {renderSideMenu(item.subNav, itemPath)}
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

export default function SideMenu({
  userNav,
  rolePath,
  openKeys,
  selectedKeys,
}: {
  userNav: DynamicNav[]
  rolePath: string
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
