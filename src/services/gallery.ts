import { supabase } from "@/lib/supabase";

export type GalleryItem = {
  id: string;
  title?: string | null;
  caption?: string | null;
  image_url: string;
  is_published?: boolean | null;
  published_at?: string | null;
  created_at?: string | null;
};

/* =======================
   PUBLIC / HOMEPAGE
   ======================= */

export async function listHomeGallery(limit = 8): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery")
    .select("id,title,caption,image_url,is_published,published_at,created_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data || []) as GalleryItem[];
}

export async function togglePublish(id: string, publish: boolean) {
  const payload = publish
    ? { is_published: true, published_at: new Date().toISOString() }
    : { is_published: false, published_at: null as any };

  const { error } = await supabase.from("gallery").update(payload).eq("id", id);
  if (error) throw error;
}

/* =======================
   ADMIN / CRUD
   ======================= */

export async function listAllGallery(): Promise<GalleryItem[]> {
  const { data, error } = await supabase
    .from("gallery")
    .select("id,title,caption,image_url,is_published,published_at,created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []) as GalleryItem[];
}

// Alias nyaman: listGallery == listAllGallery
export const listGallery = listAllGallery;

export async function getGallery(id: string): Promise<GalleryItem | null> {
  const { data, error } = await supabase
    .from("gallery")
    .select("id,title,caption,image_url,is_published,published_at,created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return (data as GalleryItem) ?? null;
}

// ====> Alias agar impor lama tetap jalan
export const getGalleryById = getGallery;

export async function createGallery(
  payload: Partial<GalleryItem> & { image_url: string },
) {
  const { data, error } = await supabase
    .from("gallery")
    .insert({
      title: payload.title ?? null,
      caption: payload.caption ?? null,
      image_url: payload.image_url,
      is_published: !!payload.is_published,
      published_at: payload.is_published ? new Date().toISOString() : null,
    })
    .select("id,title,caption,image_url,is_published,published_at,created_at")
    .single();

  if (error) throw error;
  return data as GalleryItem;
}

export async function updateGallery(id: string, payload: Partial<GalleryItem>) {
  const { data, error } = await supabase
    .from("gallery")
    .update({
      title: payload.title ?? null,
      caption: payload.caption ?? null,
      image_url: payload.image_url ?? undefined, // jangan timpa kalau undefined
      is_published:
        typeof payload.is_published === "boolean"
          ? payload.is_published
          : undefined,
      published_at:
        typeof payload.is_published === "boolean"
          ? payload.is_published
            ? new Date().toISOString()
            : null
          : undefined,
    })
    .eq("id", id)
    .select("id,title,caption,image_url,is_published,published_at,created_at")
    .single();

  if (error) throw error;
  return data as GalleryItem;
}

export async function deleteGallery(id: string) {
  // ambil image_url untuk best-effort hapus file storage
  const { data: row, error: e0 } = await supabase
    .from("gallery")
    .select("image_url")
    .eq("id", id)
    .maybeSingle();
  if (e0) throw e0;

  if (row?.image_url) {
    // pola: /storage/v1/object/public/<bucket>/<path>
    const m = row.image_url.match(
      /\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/,
    );
    if (m) {
      const bucket = m[1];
      const filePath = m[2];
      try {
        await supabase.storage.from(bucket).remove([filePath]);
      } catch {
        // abaikan error storage; tetap hapus record
      }
    }
  }

  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) throw error;
}
