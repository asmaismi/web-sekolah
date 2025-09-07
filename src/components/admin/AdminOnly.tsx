import { useLocation, Navigate } from 'react-router-dom'

export default function AdminOnly({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()
  if (!pathname.startsWith('/admin')) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
