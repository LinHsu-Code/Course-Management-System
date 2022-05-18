import router, { useRouter } from 'next/router'
import { useEffect } from 'react'
import { UserContext } from '../context/userContext'
import { useContext } from 'react'
import { Role } from '../lib/model'

export const useAuth = () => {
  const user = useContext(UserContext)
  console.log(user)
  useEffect(() => {
    if (!user.token) {
      router.replace('/login', undefined, { shallow: true })
    }
  }, [user.token])
}

export const useUser = () => {
  const user = useContext(UserContext)
  console.log(user)
  useEffect(() => {
    if (user.role) {
      router.replace(`/dashboard/${user.role}`, undefined, { shallow: true })
    }
  }, [user.role])
}

export const useRole = () => {
  const router = useRouter()
  const role = router.pathname.split('/')[2] as Role
  //const role = localStorage.getItem('role') as Role
  console.log(role)

  return role
}
