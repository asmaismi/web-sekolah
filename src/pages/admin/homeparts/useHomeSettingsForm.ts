// src/pages/admin/homeparts/useHomeSettingsForm.ts
import type { HomeTemplateKey } from "@/components/home/global/registry";
import { useSettings, type SiteSettings } from "@/store/settings";
import { useMemo, useState } from "react";
// ⬇️ Pakai fungsi simpan yang sudah kamu pakai di HomeSettings.
// Jika namanya beda (mis. saveSettings/patchSettings), ganti import ini.
import { updateSettings } from "@/services/settings";

type HomeToggles = {
  home_show_welcome?: boolean;
  home_show_news?: boolean;
  home_show_events?: boolean;
  home_show_announcements?: boolean;
  home_show_gallery?: boolean;
  home_show_whyus?: boolean;
  home_template?: HomeTemplateKey;
  home_gallery_limit?: number;
  home_show_teacher_login?: boolean;
};

export function useHomeSettingsForm() {
  const { data, refresh } = useSettings();
  const base = (data as SiteSettings & HomeToggles) ?? ({} as SiteSettings & HomeToggles);

  const defaults: Required<Omit<HomeToggles, "home_template">> & { home_template: HomeTemplateKey } = {
    home_show_welcome: true,
    home_show_news: true,
    home_show_events: true,
    home_show_announcements: true,
    home_show_gallery: true,
    home_show_whyus: true,
    home_show_teacher_login: false,
    home_gallery_limit: base.home_gallery_limit ?? 8,
    home_template: (base.home_template as HomeTemplateKey) ?? "universitas",
  };

  const initial = useMemo(() => ({ ...defaults, ...base }), [data]);
  const [f, setF] = useState(initial);
  const [saving, setSaving] = useState(false);

  async function save(partial?: Partial<HomeToggles>) {
    setSaving(true);
    try {
      const payload =
        partial ??
        ({
          home_show_welcome: f.home_show_welcome,
          home_show_news: f.home_show_news,
          home_show_events: f.home_show_events,
          home_show_announcements: f.home_show_announcements,
          home_show_gallery: f.home_show_gallery,
          home_show_whyus: f.home_show_whyus,
          home_show_teacher_login: f.home_show_teacher_login,
          home_template: f.home_template,
          home_gallery_limit: f.home_gallery_limit,
        } as HomeToggles);

      await updateSettings(payload); // ganti kalau nama fungsi simpanmu beda
      await refresh();
    } finally {
      setSaving(false);
    }
  }

  return { f, setF, save, saving };
}
export type { HomeToggles };

