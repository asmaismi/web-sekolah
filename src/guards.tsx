import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/store/auth'

function LoadingScreen() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center text-slate-500">
      Memuat…
    </div>
  )
}

export default function RequireAuth() {
  const { user, status } = useAuth()
  const location = useLocation()

  // TUNGGU hydrating selesai dulu supaya nggak keburu redirect ke login
  if (status !== 'ready') return <LoadingScreen />

  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
