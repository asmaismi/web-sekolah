export type News = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  date: string | Date;
  cover_url?: string;
};

export type Event = {
  id: string;
  title: string;
  slug: string;
  date: string | Date;
  place?: string;
  excerpt?: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  caption?: string | null;
  url: string;
  created_at?: string | Date;
};
