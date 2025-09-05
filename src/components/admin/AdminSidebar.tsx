import { NavLink, useNavigate } from 'react-router-dom'
import { Newspaper, CalendarDays, Image, Settings, LayoutDashboard, LogOut } from 'lucide-react'
import { useAuth } from '@/store/auth'


const item = 'flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100'


export default function AdminSidebar() {
const nav = useNavigate()
const logout = useAuth(s => s.logout)
return (
<aside className="hidden md:block border-r p-4 min-h-dvh">
<div className="text-sm font-bold mb-4">Admin</div>
<nav className="space-y-1">
<NavLink to="/admin" end className={({isActive}) => isActive ? `${item} bg-slate-100` : item}><LayoutDashboard className="w-4 h-4"/>Dashboard</NavLink>
<NavLink to="/admin/berita" className={({isActive}) => isActive ? `${item} bg-slate-100` : item}><Newspaper className="w-4 h-4"/>Berita</NavLink>
<NavLink to="/admin/acara" className={({isActive}) => isActive ? `${item} bg-slate-100` : item}><CalendarDays className="w-4 h-4"/>Acara</NavLink>
<NavLink to="/admin/galeri" className={({isActive}) => isActive ? `${item} bg-slate-100` : item}><Image className="w-4 h-4"/>Galeri</NavLink>
<NavLink to="/admin/settings" className={({isActive}) => isActive ? `${item} bg-slate-100` : item}><Settings className="w-4 h-4"/>Settings</NavLink>
</nav>
<button onClick={() => { logout(); nav('/admin/login') }} className="mt-8 text-slate-600 hover:text-slate-900 flex items-center gap-2">
<LogOut className="w-4 h-4"/> Logout
</button>
</aside>
)
}