import { useRouter } from 'next/router'

export const useRouterPath = () => {
  const router = useRouter()
  const route = router.pathname
  return route
}
