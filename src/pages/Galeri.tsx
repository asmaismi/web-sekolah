import { useEffect, useState } from 'react'
import Container from '@/components/common/Container'
import { mockApi } from '@/mock/service'
import type { GalleryItem } from '@/mock/types'


export default function Galeri() {
const [items, setItems] = useState<GalleryItem[]>([])
useEffect(() => { mockApi.listGallery().then(setItems) }, [])


return (
<Container>
<h1 className="text-3xl font-bold my-6">Galeri</h1>
<div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
{items.map(g => (
<figure key={g.id} className="border rounded-2xl overflow-hidden">
<div className="aspect-video bg-slate-100" aria-label={g.title} />
<figcaption className="p-3 text-sm text-slate-600">{g.title}</figcaption>
</figure>
))}
</div>
</Container>
)
}