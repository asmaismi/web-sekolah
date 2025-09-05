import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { mockApi } from '@/mock/service'

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)+/g,'')
}

export default function NewsForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!id) return
    mockApi.getNewsById(id).then((n: any) => {
      if (!n) return
      setTitle(n.title || ''); setSlug(n.slug || '')
      setExcerpt(n.excerpt || ''); setContent(n.content || '')
    })
  }, [id])

  useEffect(() => { if (!id) setSlug(slugify(title)) }, [title])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    await mockApi.upsertNews({ id, title, slug, excerpt, content })
    nav('/admin/berita')
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">{id ? 'Edit' : 'Tambah'} Berita</h1>
      <div>
        <label className="block text-sm">Judul</label>
        <input className="w-full mt-1 border rounded-xl px-3 py-2" value={title} onChange={e=>setTitle(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm">Slug</label>
        <input className="w-full mt-1 border rounded-xl px-3 py-2" value={slug} onChange={e=>setSlug(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm">Excerpt</label>
        <textarea rows={3} className="w-full mt-1 border rounded-xl px-3 py-2" value={excerpt} onChange={e=>setExcerpt(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm">Konten</label>
        <textarea rows={8} className="w-full mt-1 border rounded-xl px-3 py-2" value={content} onChange={e=>setContent(e.target.value)} />
      </div>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl">Simpan</button>
    </form>
  )
}
