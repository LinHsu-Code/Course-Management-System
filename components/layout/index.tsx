import HomeLayout from './homeLayout'
import DashboardLayout from './dashboardLayout'
import AuthLayout from './authLayout'

export default function Layout({
  children,
  layoutType,
}: {
  children: React.ReactNode
  layoutType?: string
}) {
  switch (layoutType) {
    case 'auth':
      return <AuthLayout> {children}</AuthLayout>
    case 'home':
      return <HomeLayout> {children}</HomeLayout>
    default:
      return <DashboardLayout> {children}</DashboardLayout>
  }
}
