import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

type Role = 'user' | 'admin'
interface Profile { id: string; full_name: string | null; role: Role | null }
interface AuthState {
  session: Session | null
  profile: Profile | null
  loading: boolean
  init: () => Promise<void>
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  session: null,
  profile: null,
  loading: false,
  async init() {
    const { data } = await supabase.auth.getSession()
    set({ session: data.session ?? null })
    if (data.session) await fetchProfile(set)
    supabase.auth.onAuthStateChange(async (_e, session) => {
      set({ session: session ?? null })
      if (session) await fetchProfile(set); else set({ profile: null })
    })
  },
  async login(email, password) {
    set({ loading: true })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    set({ loading: false })
    return error ? { ok: false, error: error.message } : { ok: true }
  },
  async logout() {
    await supabase.auth.signOut()
    set({ session: null, profile: null })
  },
}))

async function fetchProfile(set: any) {
  const { data: userData } = await supabase.auth.getUser()
  const uid = userData.user?.id
  if (!uid) { set({ profile: null }); return }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('id', uid)           // <= penting: hanya baris milik user
    .maybeSingle()

  if (error) {
    console.error('fetchProfile error', error)
    set({ profile: null })
    return
  }
  set({ profile: (data as any) ?? null })
}

