// src/components/home/feature-dsl.tsx
import type { GalleryItem } from "@/services/gallery";
import type { SiteSettings } from "@/store/settings";

// Import komponen fitur (jika belum ada, biarkan ts-ignore sementara)
 /* @ts-ignore */ /* @ts-ignore */ import _AnnouncementsWidget from "@/components/home/AnnouncementsWidget";
/* @ts-ignore */ import _EventsWidget from "@/components/home/EventsWidget";
/* @ts-ignore */ import _GalleryBlock from "@/components/home/GalleryBlock";
import _HeroBlock from "@/components/home/HeroBlock";
/* @ts-ignore */ import _NewsBlock from "@/components/home/NewsBlock";
/* @ts-ignore */ import _WelcomeBlock from "@/components/home/WelcomeBlock";
/* @ts-ignore */ import _WhyUsBlock from "@/components/home/WhyUsBlock";

// Longgarkan tipe agar tidak ribut dengan props aktual
const HeroBlock: any = _HeroBlock as any;
const WelcomeBlock: any = _WelcomeBlock as any;
const NewsBlock: any = _NewsBlock as any;
const EventsWidget: any = _EventsWidget as any;
const AnnouncementsWidget: any = _AnnouncementsWidget as any;
const GalleryBlock: any = _GalleryBlock as any;
const WhyUsBlock: any = _WhyUsBlock as any;

// ===== Bentuk F yang baru: fungsi-fungsi opsional (PascalCase) =====
export type FeatureMap = {
  Hero?: () => JSX.Element | null;
  Welcome?: () => JSX.Element | null;
  News?: () => JSX.Element | null;
  Events?: () => JSX.Element | null;
  Announcements?: () => JSX.Element | null;
  Gallery?: () => JSX.Element | null;
  WhyUs?: () => JSX.Element | null;

  // optional hooks kalau kamu punya:
  Major?: () => JSX.Element | null;
  Sidebar?: () => JSX.Element | null;
};

// util: bikin fungsi fitur dari boolean + node
const on = (cond: any, node: JSX.Element): (() => JSX.Element | null) | undefined =>
  cond ? () => node : undefined;

export function buildFeatures(s: SiteSettings, galeri: GalleryItem[]): FeatureMap {
  const F: FeatureMap = {
    Hero: on((s as any)?.home_show_hero, <HeroBlock {...(s as any)} />),

    Welcome: on((s as any)?.home_show_welcome, (
      <WelcomeBlock
        title={(s as any)?.home_welcome_title}
        body={(s as any)?.home_welcome_body}
        imageUrl={(s as any)?.home_welcome_image_url}
        principalName={(s as any)?.home_principal_name}
      />
    )),

    News: on((s as any)?.home_show_news, (
      <NewsBlock limit={(s as any)?.home_news_limit ?? 6} />
    )),

    Events: on((s as any)?.home_show_events, (
      <EventsWidget limit={(s as any)?.home_events_limit ?? 6} />
    )),

    Announcements: on((s as any)?.home_show_announcements, (
      <AnnouncementsWidget limit={(s as any)?.home_announcements_limit ?? 5} />
    )),

    Gallery: on((s as any)?.home_show_gallery, (
      <GalleryBlock items={(galeri as any) ?? []} galeri={(galeri as any) ?? []} limit={(s as any)?.home_gallery_limit} />
    )),

    WhyUs: on((s as any)?.home_show_whyus, <WhyUsBlock />),

    // Major / Sidebar bisa kamu isi kapan siap; sementara dibiarkan undefined (frame pakai ?.())
    // Major: on(true, <MajorBlock />),
    // Sidebar: on(true, <SidebarBlock />),
  };

  // ====== Back-compat aliases (biar F.hero dsb tetap jalan) ======
  const A = F as any;
  const alias = (key: keyof FeatureMap, aliasKey: string) => {
    Object.defineProperty(A, aliasKey, {
      enumerable: true,
      get: () => (F[key] ? F[key]!() : null),
    });
  };
  alias("Hero", "hero");
  alias("Welcome", "welcome");
  alias("News", "news");
  alias("Events", "events");
  alias("Announcements", "announcements");
  alias("Gallery", "gallery");
  alias("WhyUs", "whyus");

  return F;
}

// TemplateComp signature tetap
export type TemplateComp = (p: { s: SiteSettings; galeri: GalleryItem[]; F: FeatureMap }) => JSX.Element;
