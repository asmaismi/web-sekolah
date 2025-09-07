import { supabase } from "../lib/supabase";

export type Announcement = {
  id: string;
  title: string;
  body?: string | null;
  active_from?: string | null;
  active_to?: string | null;
  pinned: boolean;
  status: "draft" | "published";
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type AnnouncementInput = {
  title: string;
  body?: string;
  active_from?: string | null;
  active_to?: string | null;
  pinned?: boolean;
  status?: "draft" | "published";
};

export async function listAnnouncements(opts?: {
  q?: string;
  status?: "all" | "draft" | "published";
  order?: "created_at" | "published_at" | "active_from";
  ascending?: boolean;
}) {
  const q = opts?.q?.trim();
  const status = opts?.status ?? "all";
  const order = opts?.order ?? "created_at";
  const ascending = !!opts?.ascending;

  let query = supabase
    .from("announcements")
    .select("*")
    .order(order, { ascending });
  if (q && q.length > 0) query = query.ilike("title", `%${q}%`);
  if (status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Announcement[];
}

export async function getAnnouncementById(id: string) {
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Announcement;
}

export async function createAnnouncement(payload: AnnouncementInput) {
  const { data, error } = await supabase
    .from("announcements")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as Announcement;
}

export async function updateAnnouncement(
  id: string,
  payload: Partial<AnnouncementInput>,
) {
  const { data, error } = await supabase
    .from("announcements")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Announcement;
}

export async function deleteAnnouncement(id: string) {
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) throw error;
}

export async function setAnnPublish(id: string, publish: boolean) {
  const payload: Partial<AnnouncementInput> = publish
    ? ({ status: "published", published_at: new Date().toISOString() } as any)
    : ({ status: "draft", published_at: null } as any);
  const { data, error } = await supabase
    .from("announcements")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Announcement;
}
