import { Breadcrumb } from 'antd'
import { useBreadcrumbPath } from '../custom-hooks/useBreadcrumbPath'

export default function BreadCrumbs() {
  const breadCrumb = useBreadcrumbPath()
  console.log(breadCrumb)

  return (
    <Breadcrumb style={{ marginBottom: '1rem' }}>
      {breadCrumb.map((route, index) => (
        <Breadcrumb.Item key={index}>
          <a href="">{route}</a>
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  )
}
