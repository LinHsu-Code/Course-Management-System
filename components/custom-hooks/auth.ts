import { useRouter } from 'next/router'
import { Role } from '../../lib/model'

export function useUserRole(): Role {
  const router = useRouter()
  return router.pathname.split('/')[2] as Role
}
