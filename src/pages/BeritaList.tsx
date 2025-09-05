import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { mockApi } from '@/mock/service'
import type { News } from '@/mock/types'


export default function BeritaList() {
const [items, setItems] = useState<News[]>([])
useEffect(() => { mockApi.listNews().then(setItems) }, [])


return (
<div className="mx-auto max-w-7xl px-4 py-10">
<h1 className="text-3xl font-bold mb-6">Berita</h1>
<div className="grid md:grid-cols-3 gap-6">
{items.map(n => (
<Link key={n.id} to={`/berita/${n.slug}`} className="block border rounded-2xl p-4 hover:shadow">
<div className="text-xs text-slate-500">{new Date(n.date).toLocaleDateString()}</div>
<h2 className="font-semibold mt-1">{n.title}</h2>
<p className="text-slate-600 mt-2 line-clamp-2">{n.excerpt}</p>
</Link>
))}
</div>
</div>
)
}