import type { SiteSettings, HomeLayoutKey } from "@/services/settings";

export type WelcomeLayoutKey = HomeLayoutKey;

export type WelcomeLayoutProps = {
  s: SiteSettings | undefined;
};
