import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Dashboard() {
  const router = useRouter()
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login', undefined, { shallow: true })
    }

    if (localStorage.getItem('role')) {
      router.push(`/dashboard/${localStorage.getItem('role')}`, undefined, {
        shallow: true,
      })
    }
  }, [])
  return null
}
