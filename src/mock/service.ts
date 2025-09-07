import type { News, Event, GalleryItem } from "./types";
import { NEWS } from "./news";
import { EVENTS } from "./events";
import { GALLERY } from "./gallery";

function delay(ms = 250) {
  return new Promise((r) => setTimeout(r, ms));
}

export const mockApi = {
  async listNews(): Promise<News[]> {
    await delay();
    return NEWS;
  },
  async getNewsBySlug(slug: string): Promise<News | null> {
    await delay();
    return NEWS.find((n) => n.slug === slug) ?? null;
  },
  async listEvents(): Promise<Event[]> {
    await delay();
    return EVENTS;
  },
  async listGallery(): Promise<GalleryItem[]> {
    await delay();
    return GALLERY;
  },
};

export type { News, Event, GalleryItem };
