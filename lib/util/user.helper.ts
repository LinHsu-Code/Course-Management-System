export const isAuth = () => {
  const token = localStorage.getItem('token') //if api then check token
  return !!token
}
