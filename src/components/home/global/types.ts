// src/components/home/global/types.ts
import type { GalleryItem } from "@/services/gallery";
import type { SiteSettings } from "@/store/settings";

// Toggle yang dipakai di Home / Frame (opsional semua)
export type HomeToggles = {
  home_show_welcome?: boolean;
  home_show_news?: boolean;
  home_show_events?: boolean;
  home_show_announcements?: boolean;
  home_show_gallery?: boolean;
  home_show_whyus?: boolean;
  home_show_teacher_login?: boolean;
  home_gallery_limit?: number;
  home_template?: string; // pakai HomeTemplateKey kalau kamu export dari registry
};

export type FeatureMap = {
  Hero?: () => JSX.Element | null;
  Major?: () => JSX.Element | null;
  Welcome?: () => JSX.Element | null;
  News?: () => JSX.Element | null;
  Events?: () => JSX.Element | null;
  Announcements?: () => JSX.Element | null;
  Gallery?: () => JSX.Element | null;
  WhyUs?: () => JSX.Element | null;
  Sidebar?: () => JSX.Element | null;
};

export type TemplateProps = {
  s: SiteSettings & HomeToggles;
  galeri: GalleryItem[];
  F: FeatureMap;
};

export type TemplateComp = (p: TemplateProps) => JSX.Element;
