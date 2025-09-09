// src/layouts/home/registry.ts
import type { JSX } from "react";
import type { WelcomeLayoutKey } from "./types";
import WelcomeClassic from "./WelcomeClassic";
import WelcomeHeadline from "./WelcomeHeadline";

// Layout function hanya menerima { s } (props dari store settings)
type LayoutFn = (p: { s: any }) => JSX.Element | null;

export const WELCOME_LAYOUTS: Record<WelcomeLayoutKey, LayoutFn> = {
  classic: WelcomeClassic,
  headline: WelcomeHeadline,
};

export const DEFAULT_WELCOME_LAYOUT: WelcomeLayoutKey = "classic";

export function getWelcomeLayout(k: WelcomeLayoutKey) {
  return WELCOME_LAYOUTS[k] ?? WELCOME_LAYOUTS[DEFAULT_WELCOME_LAYOUT];
}
