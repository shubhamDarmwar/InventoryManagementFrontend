import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  const userRole = user?.role?.name || user?.roleName
  if (userRole !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
