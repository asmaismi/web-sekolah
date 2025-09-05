import { Link, NavLink } from 'react-router-dom'
import { School } from 'lucide-react'


export default function Navbar() {
const item = 'px-3 py-2 rounded-xl hover:bg-slate-100'
return (
<header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
<div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-6">
<Link to="/" className="flex items-center gap-2 font-bold">
<School className="w-6 h-6 text-indigo-600" />
<span>Nama Sekolah</span>
</Link>
<nav className="ml-auto flex items-center gap-1">
{[
['/', 'Beranda'],
['/profil', 'Profil'],
['/program', 'Program'],
['/berita', 'Berita'],
['/acara', 'Acara'],
['/galeri', 'Galeri'],
['/ppdb', 'PPDB'],
['/kontak', 'Kontak'],
].map(([to, label]) => (
<NavLink key={to} to={to} className={({isActive}) => isActive ? `${item} bg-slate-100` : item}>{label}</NavLink>
))}
</nav>
</div>
</header>
)
}