import { supabase } from "../lib/supabase";

export type NewsRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  cover_url?: string | null;
  status: "draft" | "published";
  date?: string | null;
  published_at?: string | null;
  tags: string[];
  category_id?: string | null;
  created_at: string;
  updated_at: string;
};

export type NewsInput = {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  cover_url?: string | null;
  status?: "draft" | "published";
  date?: string | null;
  tags?: string[];
  category_id?: string | null;
};

export function slugify(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** List dengan filter + pagination (mengembalikan items & total count) */
export async function listNewsPaged(opts?: {
  q?: string;
  status?: "all" | "draft" | "published";
  category_id?: string | null;
  page?: number;
  perPage?: number;
  order?: "created_at" | "published_at";
  ascending?: boolean;
}) {
  const q = opts?.q?.trim() || "";
  const status = opts?.status ?? "all";
  const category_id = opts?.category_id ?? null;
  const page = Math.max(1, opts?.page || 1);
  const perPage = Math.max(1, opts?.perPage || 10);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const order = opts?.order ?? "created_at";
  const ascending = !!opts?.ascending;

  let query = supabase
    .from("news")
    .select("*", { count: "exact" })
    .order(order, { ascending });

  if (q) query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);
  if (status !== "all") query = query.eq("status", status);
  if (category_id) query = query.eq("category_id", category_id);

  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return {
    items: (data ?? []) as NewsRecord[],
    count: count || 0,
    page,
    perPage,
  };
}

export async function listNews(opts?: {
  q?: string;
  status?: "all" | "draft" | "published";
  category_id?: string | null;
  limit?: number;
  offset?: number;
  order?: "created_at" | "published_at";
  ascending?: boolean;
}) {
  const q = opts?.q?.trim();
  const status = opts?.status ?? "all";
  const order = opts?.order ?? "created_at";
  const ascending = !!opts?.ascending;

  let query = supabase.from("news").select("*").order(order, { ascending });

  if (typeof opts?.limit === "number") query = query.limit(opts!.limit);
  if (typeof opts?.offset === "number")
    query = query.range(opts!.offset, opts!.offset + (opts!.limit ?? 20) - 1);
  if (q && q.length > 0)
    query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%`);
  if (status !== "all") query = query.eq("status", status);
  if (opts?.category_id) query = query.eq("category_id", opts.category_id);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as NewsRecord[];
}

export async function getNewsById(id: string) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as NewsRecord;
}

export async function getNewsBySlug(slug: string) {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) throw error;
  return data as NewsRecord;
}

export async function createNews(payload: NewsInput) {
  const { data, error } = await supabase
    .from("news")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as NewsRecord;
}

export async function updateNews(id: string, payload: Partial<NewsInput>) {
  const { data, error } = await supabase
    .from("news")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as NewsRecord;
}

export async function deleteNews(id: string) {
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw error;
}

export async function setPublish(id: string, publish: boolean) {
  const payload: Partial<NewsInput> = publish
    ? ({ status: "published", published_at: new Date().toISOString() } as any)
    : ({ status: "draft", published_at: null } as any);
  const { data, error } = await supabase
    .from("news")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as NewsRecord;
}
