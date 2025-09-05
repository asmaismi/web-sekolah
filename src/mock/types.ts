export interface News { id: string; title: string; slug: string; date: string; excerpt: string; content: string; cover?: string }
export interface Event { id: string; title: string; date: string; location: string; description?: string }
export interface GalleryItem { id: string; title: string; url: string; thumb?: string }