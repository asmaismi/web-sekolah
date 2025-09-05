import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'


export default function Home() {
return (
<div className="mx-auto max-w-7xl px-4">
<section className="py-16 grid md:grid-cols-2 gap-8 items-center">
<div>
<h1 className="text-4xl font-extrabold tracking-tight">Selamat Datang di Nama Sekolah</h1>
<p className="mt-4 text-slate-600">Sekolah unggulan dengan kurikulum modern dan lingkungan belajar yang inspiratif.</p>
<div className="mt-6 flex gap-3">
<Link to="/ppdb"><Button>Daftar PPDB</Button></Link>
<Link to="/berita"><Button variant="outline">Lihat Berita</Button></Link>
</div>
</div>
<div className="aspect-video rounded-3xl bg-gradient-to-br from-indigo-200 to-emerald-200" />
</section>
</div>
)
}