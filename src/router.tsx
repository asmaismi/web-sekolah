import AdminLayout from '@/components/layout/AdminLayout'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Profil from './pages/Profil'
import Program from './pages/Program'
import BeritaList from './pages/BeritaList'
import BeritaDetail from './pages/BeritaDetail'
import AcaraList from './pages/AcaraList'
import Galeri from './pages/Galeri'
import PPDB from './pages/PPDB'
import Kontak from './pages/Kontak'
import AdminLogin from './pages/admin/Login'
import AdminDashboard from './pages/admin/Dashboard'
import NewsList from './pages/admin/NewsList'
import NewsForm from './pages/admin/NewsForm'
import RequireAuth from './guards'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'profil', element: <Profil /> },
      { path: 'program', element: <Program /> },
      { path: 'berita', element: <BeritaList /> },
      { path: 'berita/:slug', element: <BeritaDetail /> },
      { path: 'acara', element: <AcaraList /> },
      { path: 'galeri', element: <Galeri /> },
      { path: 'ppdb', element: <PPDB /> },
      { path: 'kontak', element: <Kontak /> },
    ],
  },
  { path: '/admin/login', element: <AdminLogin /> },
{
path: '/admin',
element: <RequireAuth />, // gate
children: [
{
element: <AdminLayout />, // layout wrapper
children: [
{ index: true, element: <AdminDashboard /> },
{ path: 'berita', element: <NewsList /> },
{ path: 'berita/new', element: <NewsForm /> },
{ path: 'berita/:id/edit', element: <NewsForm /> },
// placeholder menu lain
{ path: 'acara', element: <div>Acara (admin)</div> },
{ path: 'galeri', element: <div>Galeri (admin)</div> },
{ path: 'settings', element: <div>Settings (admin)</div> },
]
}
]
}
])
