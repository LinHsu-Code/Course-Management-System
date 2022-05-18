import { useAuth, useUser } from '../../hooks'
import DashboardLayout from '../../components/layout'

export default function Page({ children }: { children: React.ReactNode }) {
  useAuth()
  useUser()
  return null
}

// export default function Page({ children }: { children: React.ReactNode }) {
//   useAuth()
//   useUser()
//   return <DashboardLayout>{children}</DashboardLayout>
// }
