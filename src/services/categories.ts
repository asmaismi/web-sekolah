import { supabase } from "../lib/supabase";

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export function slugifyCategory(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function listCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function getCategoryById(id: string): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as Category;
}

export async function createCategory(payload: {
  name: string;
  slug: string;
}): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data as Category;
}

export async function updateCategory(
  id: string,
  payload: Partial<{ name: string; slug: string }>,
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update(payload)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as Category;
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}
