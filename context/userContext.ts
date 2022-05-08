import React from 'react'
import { Role } from '../lib/model'

const user: { role: Role | ''; token: string | null } = {
  role: '',
  token: null,
}
if (typeof window !== 'undefined') {
  user.role = localStorage.getItem('role') as Role
  user.token = localStorage.getItem('token')
}

export const UserContext = React.createContext(user)
