import { Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from '@/store/auth'

export default function RequireAuth() {
  const { session, profile, init } = useAuth()
  useEffect(() => { init() }, [])
  const isAdmin = !!session && profile?.role === 'admin'
  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" replace />
}
