import type { SiteSettings } from "@/store/settings";

export type WelcomeLayoutKey = "classic" | "headline";

export type WelcomeLayoutProps = {
  s: SiteSettings | undefined;
};
