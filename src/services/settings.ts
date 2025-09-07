// src/services/settings.ts
import { supabase } from "@/lib/supabase";

export type SiteSettings = {
  site_name?: string | null;
  tagline?: string | null;
  primary_color?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  logo_url?: string | null;

  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_video_url?: string | null;
  hero_cta_label?: string | null;
  hero_cta_link?: string | null;

  home_show_welcome?: boolean | null;
  home_welcome_title?: string | null;
  home_welcome_body?: string | null;
  home_welcome_image_url?: string | null;
  home_principal_name?: string | null;

  home_show_gallery?: boolean | null;
  home_gallery_limit?: number | null;
  home_layout?: string | null;
};

export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings") // ← WAJIB: tabel ini
    .select("*")
    .eq("id", 1) // ← id tunggal
    .maybeSingle();
  if (error) throw error;
  return (data ?? {}) as SiteSettings;
}

export async function updateSettings(payload: Partial<SiteSettings>) {
  const { error } = await supabase
    .from("site_settings") // ← WAJIB: tabel ini
    .upsert({ id: 1, ...payload }, { onConflict: "id" });
  if (error) throw error;
}
