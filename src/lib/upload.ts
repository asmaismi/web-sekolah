import { supabase } from '@/lib/supabase'

export async function uploadImage(file: File) {
  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const path = `${crypto.randomUUID()}.${ext}`

  const { error } = await supabase
    .storage
    .from('images')               // pastikan bucket 'images' sudah ada & policy sudah di-setup
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data } = supabase.storage.from('images').getPublicUrl(path)
  return data.publicUrl as string
}
