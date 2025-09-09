import { buildFeatures } from "@/components/home/feature-dsl";
import { DEFAULT_HOME_TEMPLATE, HOME_TEMPLATES } from "@/components/home/global/registry";
import { listHomeGallery, type GalleryItem } from "@/services/gallery";
import type { HomeTemplateKey } from "@/services/settings";
import { useSettings, type SiteSettings } from "@/store/settings";
import { useEffect, useMemo, useState, type ReactElement } from "react";
import { useLocation } from "react-router-dom";

type FeatureMap = ReturnType<typeof buildFeatures>;
type TemplateComp = (props: { s: SiteSettings; galeri: GalleryItem[]; F: FeatureMap }) => ReactElement;

// NEW — tambahkan toggle yang memang dipakai Home sebagai ekstensi lokal
type HomeToggles = {
  home_show_welcome?: boolean;
  home_show_news?: boolean;
  home_show_events?: boolean;
  home_show_announcements?: boolean;
  home_show_gallery?: boolean;
  home_show_whyus?: boolean;
  home_gallery_limit?: number;
  home_template?: HomeTemplateKey;
};

// NEW — tipe lokal Home: SiteSettings + toggle beranda
type S = SiteSettings & HomeToggles;

const DEFAULT_TOGGLES = {
  home_show_welcome: true,
  home_show_news: true,
  home_show_events: true,
  home_show_announcements: true,
  home_show_gallery: true,
  home_show_whyus: true,
} as const;

export default function Home() {
  const { data: sRaw, refresh } = useSettings();
  const location = useLocation();
  const [galeri, setGaleri] = useState<GalleryItem[]>([]);

  // Normalisasi setting (fallback ON untuk blok utama)
  const s = useMemo<S>(() => {                    // NEW: pakai S, bukan SiteSettings
    const base = (sRaw as S) ?? ({} as S);        // NEW: treat data sebagai S
    return {
      ...base,
      home_template: (base.home_template as HomeTemplateKey) ?? DEFAULT_HOME_TEMPLATE,
      home_show_welcome: base.home_show_welcome ?? DEFAULT_TOGGLES.home_show_welcome,
      home_show_news: base.home_show_news ?? DEFAULT_TOGGLES.home_show_news,
      home_show_events: base.home_show_events ?? DEFAULT_TOGGLES.home_show_events,
      home_show_announcements: base.home_show_announcements ?? DEFAULT_TOGGLES.home_show_announcements,
      home_show_gallery: base.home_show_gallery ?? DEFAULT_TOGGLES.home_show_gallery,
      home_show_whyus: base.home_show_whyus ?? DEFAULT_TOGGLES.home_show_whyus,
    } as S;
  }, [sRaw]);

  useEffect(() => { if (location.pathname === "/") refresh(); }, [location.pathname, refresh]);

  useEffect(() => {
    const onFocus = () => refresh();
    const onVis = () => document.visibilityState === "visible" && refresh();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [refresh]);

  useEffect(() => {
    let gone = false;
    (async () => {
      if (s?.home_show_gallery) {
        const rows = await listHomeGallery(s.home_gallery_limit ?? 8); // S punya home_gallery_limit
        if (!gone) setGaleri(rows);
      } else setGaleri([]);
    })();
    return () => { gone = true; };
  }, [s?.home_show_gallery, s?.home_gallery_limit]);

  // Pilih key template -> pastikan valid
  const key = useMemo<HomeTemplateKey>(() => {
    const k = (s?.home_template as HomeTemplateKey) || DEFAULT_HOME_TEMPLATE;
    return (k in HOME_TEMPLATES ? k : DEFAULT_HOME_TEMPLATE);
  }, [s?.home_template]);

  const Template = (HOME_TEMPLATES[key] ?? HOME_TEMPLATES[DEFAULT_HOME_TEMPLATE]) as TemplateComp;
  if (!Template || typeof Template !== "function") return <HomeSkeleton />;

  const F = useMemo<FeatureMap>(() => buildFeatures(s as SiteSettings, galeri), [s, galeri]);
  if (!s) return <HomeSkeleton />;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-brand-200/60 via-emerald-200/40 to-transparent blur-3xl" />
      </div>
      <Template s={s as SiteSettings} galeri={galeri} F={F} />
    </div>
  );
}

function HomeSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 h-8 w-2/3 rounded-xl bg-slate-200/70" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-40 rounded-2xl bg-slate-200/70" />
        <div className="h-40 rounded-2xl bg-slate-200/70" />
        <div className="h-40 rounded-2xl bg-slate-200/70" />
      </div>
    </div>
  );
}
