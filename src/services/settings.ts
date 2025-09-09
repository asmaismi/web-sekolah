import { supabase } from "@/lib/supabase";

/** === Single Source of Truth (SSOT) untuk union types === */
export type HomeTemplateKey = "universitas" | "highschool" | "smp" | "sd";
export type HomeLayoutKey = "classic" | "headline";

/** Kontrak data settings (SSOT) */
export type SiteSettings = {
  // Branding
  site_name?: string | null;
  tagline?: string | null;
  logo_url?: string | null;
  primary_color?: string | null;

  // Kontak & sosial
  contact_email?: string | null; // kolom DB: contact_email
  email?: string | null; // alias (deprecated)
  phone?: string | null;
  address?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  youtube?: string | null;

  // Home page switches
  home_layout?: HomeLayoutKey | null;
  home_template?: HomeTemplateKey | null;

  home_show_hero?: boolean | null;
  home_show_welcome?: boolean | null;
  home_welcome_title?: string | null;
  home_welcome_body?: string | null;
  home_welcome_image_url?: string | null;

  home_principal_name?: string | null;

  home_show_gallery?: boolean | null;
  home_gallery_limit?: number | null;
  home_show_whyus?: boolean;

  // Hero section
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_btn_text?: string | null;
  hero_btn_url?: string | null;
  hero_btn2_text?: string | null;
  hero_btn2_url?: string | null;
  hero_media_url?: string | null;
  hero_media_autoplay?: boolean | null;
  hero_media_muted?: boolean | null;
  hero_media_loop?: boolean | null;

  // Profile section
  profile_image_url?: string | null;
  profile_text?: string | null;
  vision?: string | null;
  mission?: string | null;
  home_show_teacher_login?: boolean | null;
};

export async function getSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  return (data ?? {}) as SiteSettings;
}

const ALLOWED_KEYS: (keyof SiteSettings)[] = [
  // Branding & sosial
  "site_name",
  "tagline",
  "logo_url",
  "primary_color",
  "contact_email",
  "email",
  "phone",
  "address",
  "facebook",
  "instagram",
  "youtube",

  // Home template & layout
  "home_template",
  "home_layout",

  // Feature toggles
  "home_show_hero",

  "home_show_welcome",
  "home_welcome_title",
  "home_welcome_body",
  "home_welcome_image_url",
  "home_principal_name",
  "home_show_teacher_login",

  // Gallery section
  "home_show_gallery",
  "home_gallery_limit",

  // Hero section
  "hero_title",
  "hero_subtitle",
  "hero_btn_text",
  "hero_btn_url",
  "hero_btn2_text",
  "hero_btn2_url",
  "hero_media_url",
  "hero_media_autoplay",
  "hero_media_muted",
  "hero_media_loop",

  // Profile section
  "profile_image_url",
  "profile_text",
  "vision",
  "mission",
];

export async function updateSettings(payload: Partial<SiteSettings>) {
  // Filter hanya kolom yang ada di DB agar tidak 400
  const body = Object.fromEntries(
    Object.entries(payload).filter(([k]) => (ALLOWED_KEYS as string[]).includes(k)),
  );

  // Pastikan baris id=1 selalu ada (UPSERT)
  const { data, error } = await supabase
    .from("site_settings")
    .upsert([{ id: 1, ...body }], { onConflict: "id" })
    .select("*")
    .single();

  if (error) throw error;
  return data as SiteSettings;
}
