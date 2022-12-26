import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function RequireAuth({ allowedRoles = [] }) {
  const { auth, role } = useAuth()

  return auth && allowedRoles.includes(role) ? (
    <Outlet />
  ) : (
    <Navigate to='/login' replace />
  )
}
