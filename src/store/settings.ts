import { create } from "zustand";
import { supabase } from "@/lib/supabase";

export type SiteSettings = {
  id: number;
  site_name?: string | null;
  tagline?: string | null;
  logo_url?: string | null;
  primary_color?: string | null;

  contact_email?: string | null;
  phone?: string | null;
  address?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  youtube?: string | null;

  profile_image_url?: string | null;
  profile_text?: string | null;
  vision?: string | null;
  mission?: string | null;

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

  home_show_welcome?: boolean | null;
  home_welcome_title?: string | null;
  home_welcome_body?: string | null;
  home_welcome_image_url?: string | null;

  home_show_gallery?: boolean | null;
  home_gallery_limit?: number | null;
  home_principal_name?: string | null;
  home_layout?: string | null;
};

type State = {
  data: SiteSettings | null;
  status: "idle" | "loading" | "ready" | "error";
  error?: string | null;
  init: () => Promise<void>;
  refresh: () => Promise<void>;
};

async function fetchSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  if (error) throw error;
  if (!data) {
    const def = {
      id: 1,
      site_name: "Nama Sekolah",
      tagline: "Tagline sekolah",
    };
    const { data: inserted, error: e2 } = await supabase
      .from("site_settings")
      .insert(def)
      .select("*")
      .single();
    if (e2) throw e2;
    return inserted as SiteSettings;
  }
  return data as SiteSettings;
}

function applyPrimaryColor(s?: string | null) {
  if (!s) return;
  document.documentElement.style.setProperty("--primary", s);
}

export const useSettings = create<State>((set, get) => ({
  data: null,
  status: "idle",
  error: null,

  refresh: async () => {
    if (get().status === "loading") return;
    set({ status: "loading", error: null });
    try {
      const s = await fetchSettings();
      applyPrimaryColor(s.primary_color);
      set({ data: s, status: "ready" });
    } catch (e: any) {
      set({ status: "error", error: e?.message || "Gagal memuat settings" });
    }
  },

  init: async () => {
    const st = get().status;
    if (st === "ready" || st === "loading") return;
    await get().refresh();

    const channel = supabase
      .channel("site_settings_rt")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "site_settings",
          filter: "id=eq.1",
        },
        (payload) => {
          console.log(
            "[RT] site_settings changed:",
            payload.eventType,
            payload.new,
          );
          get().refresh();
        },
      )
      .subscribe();

    if (import.meta && (import.meta as any).hot) {
      (import.meta as any).hot.dispose(() => {
        try {
          supabase.removeChannel(channel);
        } catch {}
      });
    }
  },
}));
