import type { SiteSettings } from "@/services/settings";
import type { WelcomeLayoutKey } from "@/layouts/home/types";
import {
  WELCOME_LAYOUTS,
  DEFAULT_WELCOME_LAYOUT,
} from "@/layouts/home/registry";

export default function WelcomeBlock({ s }: { s: SiteSettings }) {
  if (!s?.home_show_welcome) return null;
  const key: WelcomeLayoutKey = ( (s.home_layout as any) || DEFAULT_WELCOME_LAYOUT ) as WelcomeLayoutKey;
  const Comp = WELCOME_LAYOUTS[key] ?? WELCOME_LAYOUTS[DEFAULT_WELCOME_LAYOUT];
  return <Comp s={s} />;
}
