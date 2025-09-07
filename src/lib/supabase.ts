import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,        // pastikan pakai localStorage di FE
    storageKey: 'websekolah-auth',
    detectSessionInUrl: true,     // aman untuk OAuth (nggak ganggu di basic email+password)
  },
})
