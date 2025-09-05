import { supabase } from '@/lib/supabase'
import { NEWS } from './news'
import { EVENTS } from './events'
import { GALLERY } from './gallery'
import type { News, Event, GalleryItem } from './types'

const USE_SB = !!import.meta.env.VITE_SUPABASE_URL

export const mockApi = {
  async listNews(): Promise<News[]> {
    if (!USE_SB) return NEWS
    const { data, error } = await supabase
      .from('news')
      .select('id, title, slug, excerpt, content, cover_url, is_published, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
    if (error) throw error
    return (data || []).map((d: any) => ({
      id: d.id, title: d.title, slug: d.slug, excerpt: d.excerpt,
      content: d.content, cover: d.cover_url, date: d.published_at,
    }))
  },

  async getNewsBySlug(slug: string): Promise<News | undefined> {
    if (!USE_SB) return NEWS.find(n => n.slug === slug)
    const { data, error } = await supabase
      .from('news')
      .select('id, title, slug, excerpt, content, cover_url, is_published, published_at')
      .eq('slug', slug)
      .maybeSingle()
    if (error) throw error
    return data ? {
      id: data.id, title: data.title, slug: data.slug, excerpt: data.excerpt,
      content: data.content, cover: data.cover_url, date: data.published_at,
    } : undefined
  },

  async listEvents(): Promise<Event[]> {
    if (!USE_SB) return EVENTS
    const { data, error } = await supabase
      .from('events')
      .select('id, title, date, location, description, is_published')
      .eq('is_published', true)
      .order('date', { ascending: true })
    if (error) throw error
    return data as Event[]
  },

  async listGallery(): Promise<GalleryItem[]> {
    if (!USE_SB) return GALLERY
    const { data, error } = await supabase
      .from('gallery')
      .select('id, title, image_url as url, is_published')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data || []) as GalleryItem[]
  },

  // Admin
  async upsertNews(payload: Partial<News> & { id?: string }) {
    const { data, error } = await supabase.from('news').upsert({
      id: payload.id,
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      content: payload.content,
      cover_url: payload.cover,
      is_published: (payload as any).is_published ?? true,
      published_at: (payload as any).date ?? new Date().toISOString(),
    }).select().maybeSingle()
    if (error) throw error
    return data
  },

  async getNewsById(id: string) {
    const { data, error } = await supabase.from('news').select('*').eq('id', id).maybeSingle()
    if (error) throw error
    return data
  },
}
