import { supabase } from "../lib/supabase";

export type EventRecord = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  start_at: string;
  end_at?: string | null;
  cover_url?: string | null;
  status: "draft" | "published";
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type EventInput = {
  title: string;
  slug: string;
  description?: string;
  location?: string;
  start_at: string;
  end_at?: string | null;
  cover_url?: string | null;
  status?: "draft" | "published";
};

export function slugify(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Admin list + filter + pagination */
export async function listEventsPaged(opts?: {
  q?: string;
  status?: "all" | "draft" | "published";
  range?: "all" | "upcoming" | "past";
  page?: number;
  perPage?: number;
  order?: "start_at" | "created_at";
  ascending?: boolean;
}) {
  const q = opts?.q?.trim() || "";
  const status = opts?.status ?? "all";
  const range = opts?.range ?? "all";
  const page = Math.max(1, opts?.page || 1);
  const perPage = Math.max(1, opts?.perPage || 10);
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const order = opts?.order ?? "start_at";
  const ascending = !!opts?.ascending;

  const nowIso = new Date().toISOString();

  let query = supabase
    .from("events")
    .select("*", { count: "exact" })
    .order(order, { ascending });

  if (q)
    query = query.or(
      `title.ilike.%${q}%,description.ilike.%${q}%,location.ilike.%${q}%`,
    );
  if (status !== "all") query = query.eq("status", status);
  if (range === "upcoming") query = query.gte("start_at", nowIso);
  if (range === "past") query = query.lt("start_at", nowIso);

  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;
  return {
    items: (data ?? []) as EventRecord[],
    count: count || 0,
    page,
    perPage,
  };
}

/** Publik: daftar agenda mendatang (published) */
export async function listPublicUpcoming(limit = 10) {
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("status", "published")
    .gte("start_at", nowIso)
    .order("start_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return (data ?? []) as EventRecord[];
}

export async function getEventById(id: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as EventRecord;
}

/** Publik: ambil agenda by slug (published saja) */
export async function getEventBySlug(slug: string) {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  if (error) throw error;
  return data as EventRecord;
}

export async function createEvent(payload: EventInput) {
  const { data, error } = await supabase
    .from("events")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as EventRecord;
}

export async function updateEvent(id: string, payload: Partial<EventInput>) {
  const { data, error } = await supabase
    .from("events")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as EventRecord;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) throw error;
}

export async function setPublish(id: string, publish: boolean) {
  const payload: Partial<EventInput> = publish
    ? ({ status: "published", published_at: new Date().toISOString() } as any)
    : ({ status: "draft", published_at: null } as any);
  const { data, error } = await supabase
    .from("events")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as EventRecord;
}
