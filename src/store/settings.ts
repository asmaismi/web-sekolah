import { create } from "zustand";
import { supabase } from "@/lib/supabase";

import type { SiteSettings as CoreSiteSettings } from "@/services/settings";
export type SiteSettings = CoreSiteSettings & { id: number };

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
