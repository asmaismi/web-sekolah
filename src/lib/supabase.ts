import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,      // tanda ! penting
  import.meta.env.VITE_SUPABASE_ANON_KEY!  // tanda ! penting
)
