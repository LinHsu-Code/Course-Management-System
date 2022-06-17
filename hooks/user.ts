export const useUserInfo = () => {
  const userId = Number(localStorage.getItem('userId'))
  const role = localStorage.getItem('role')
  const token = localStorage.getItem('token')

  return { userId, role, token }
}
