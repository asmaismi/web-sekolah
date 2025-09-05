import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { mockApi } from '@/mock/service'
import type { News } from '@/mock/types'


export default function NewsList() {
const [items, setItems] = useState<News[]>([])
useEffect(() => { mockApi.listNews().then(setItems) }, [])


return (
<div className="mx-auto max-w-7xl px-4 py-8">
<div className="flex items-center justify-between mb-6">
<h1 className="text-2xl font-bold">Berita (Admin)</h1>
<Link to="/admin/berita/new" className="bg-indigo-600 text-white px-4 py-2 rounded-xl">Tambah</Link>
</div>
<div className="border rounded-2xl overflow-hidden">
<table className="w-full text-sm">
<thead className="bg-slate-50">
<tr>
<th className="text-left p-3">Judul</th>
<th className="text-left p-3">Tanggal</th>
<th className="text-left p-3">Aksi</th>
</tr>
</thead>
<tbody>
{items.map(n => (
<tr key={n.id} className="border-t">
<td className="p-3">{n.title}</td>
<td className="p-3">{new Date(n.date).toLocaleDateString()}</td>
<td className="p-3">
<Link to={`/admin/berita/${n.id}/edit`} className="text-indigo-600 hover:underline">Edit</Link>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
)
}