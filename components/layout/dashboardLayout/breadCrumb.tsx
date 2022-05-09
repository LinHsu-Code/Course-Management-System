import { Breadcrumb } from 'antd'
import { DynamicNav } from '../../../lib/model'

const renderBreadCrumb = (
  breadcrumbDate: DynamicNav[],
  parentPath: string[]
) => {
  return breadcrumbDate
    .slice(0, breadcrumbDate.length - 1)
    .map((item: DynamicNav) => {
      const itemPath = item.path ? [...parentPath, item.path] : parentPath
      return (
        <Breadcrumb.Item key={itemPath.join('/')}>
          <a href={itemPath.join('/')}>{item.label}</a>
        </Breadcrumb.Item>
      )
    })
    .concat(
      <Breadcrumb.Item key="current">
        {breadcrumbDate.slice(-1)[0].label}
      </Breadcrumb.Item>
    )
}

export default function BreadCrumb({
  breadcrumbDate,
  rolePath,
}: {
  breadcrumbDate: DynamicNav[]
  rolePath: string[]
}) {
  return (
    <Breadcrumb style={{ padding: '16px 24px' }}>
      {renderBreadCrumb(breadcrumbDate, rolePath)}
    </Breadcrumb>
  )
}
