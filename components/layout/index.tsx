import HomeLayout from './homeLayout'
import DashboardLayout from './dashboardLayout'
import AuthLayout from './authLayout'

export default function Layout({
  children,
  layoutType,
  hasBackTop = false,
}: {
  children: React.ReactNode
  layoutType?: string
  hasBackTop?: boolean
}) {
  switch (layoutType) {
    case 'auth':
      return <AuthLayout> {children}</AuthLayout>
    case 'home':
      return <HomeLayout> {children}</HomeLayout>
    default:
      return (
        <DashboardLayout hasBackTop={hasBackTop}> {children}</DashboardLayout>
      )
  }
}
