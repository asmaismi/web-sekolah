import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Container from '@/components/common/Container'
import { mockApi } from '@/mock/service'
import type { News } from '@/mock/types'


export default function BeritaDetail() {
const { slug } = useParams()
const [item, setItem] = useState<News | null>(null)
useEffect(() => { if (slug) mockApi.getNewsBySlug(slug).then(n => setItem(n ?? null)) }, [slug])


if (!item) return <Container><div className="py-10">Memuat…</div></Container>


return (
<Container>
<article className="prose max-w-none">
<h1>{item.title}</h1>
<p className="text-sm text-slate-500">{new Date(item.date).toLocaleDateString()}</p>
<p>{item.content}</p>
</article>
</Container>
)
}