import { useAuth, useUser } from '../../hooks'

export default function Page() {
  useAuth()
  useUser()
  return null
}
