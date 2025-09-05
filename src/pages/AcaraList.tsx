import { useEffect, useState } from 'react'
import Container from '@/components/common/Container'
import { mockApi } from '@/mock/service'
import type { Event } from '@/mock/types'


export default function AcaraList() {
const [items, setItems] = useState<Event[]>([])
useEffect(() => { mockApi.listEvents().then(setItems) }, [])


return (
<Container>
<h1 className="text-3xl font-bold my-6">Acara / Agenda</h1>
<div className="divide-y rounded-2xl border">
{items.map(e => (
<div key={e.id} className="p-4 grid md:grid-cols-4 gap-4">
<div className="text-slate-500">{new Date(e.date).toLocaleDateString()}</div>
<div className="md:col-span-2">
<div className="font-semibold">{e.title}</div>
{e.description && <div className="text-slate-600">{e.description}</div>}
</div>
<div className="text-slate-500">{e.location}</div>
</div>
))}
</div>
</Container>
)
}