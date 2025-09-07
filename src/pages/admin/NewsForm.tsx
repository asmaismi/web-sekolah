import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import Section from "../../components/common/Section";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Textarea from "../../components/ui/Textarea";
import useUI from "../../store/ui";
import { uploadImage } from "../../lib/upload";
import {
  createNews,
  getNewsById,
  updateNews,
  slugify,
  type NewsRecord,
  type NewsInput,
} from "../../services/news";
import { listCategories, type Category } from "../../services/categories";
import MarkdownEditor from "../../components/form/MarkdownEditor";
import TagsInput from "../../components/form/TagsInput";
import AdminOnly from "../../components/admin/AdminOnly";

type Form = {
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
  content?: string;
  cover_url?: string | null;
  cover_file?: File | null;
  status: "draft" | "published";
  category_id?: string | null;
  tags: string[];
};

export default function NewsForm() {
  const nav = useNavigate();
  const { id } = useParams();
  const addToast = useUI((s) => s.add);

  const [categories, setCategories] = useState<Category[]>([]);
  const [data, setData] = useState<Form>({
    title: "",
    slug: "",
    date: "",
    excerpt: "",
    content: "",
    cover_url: null,
    cover_file: null,
    status: "draft",
    category_id: "",
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setCategories(await listCategories());
      } catch (e: any) {
        addToast(e?.message || "Gagal memuat kategori");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const row: NewsRecord = await getNewsById(id);
        setData({
          title: row.title ?? "",
          slug: row.slug ?? "",
          date: row.date ? new Date(row.date).toISOString().slice(0, 10) : "",
          excerpt: row.excerpt ?? "",
          content: row.content ?? "",
          cover_url: row.cover_url ?? null,
          cover_file: null,
          status: row.status ?? "draft",
          category_id: row.category_id ?? "",
          tags: row.tags ?? [],
        });
        setDirty(false);
      } catch (e: any) {
        addToast(e?.message || "Gagal memuat data");
      }
    })();
  }, [id]);

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  function toSlug(s: string) {
    return slugify(s);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      let cover_url = data.cover_url ?? undefined;
      if (data.cover_file) {
        cover_url = await uploadImage(data.cover_file);
      }

      const payload: NewsInput = {
        title: data.title.trim(),
        slug: (data.slug.trim() || toSlug(data.title)).trim(),
        date: data.date ? new Date(data.date).toISOString() : null,
        excerpt: data.excerpt?.trim() || "",
        content: data.content?.trim() || "",
        cover_url: cover_url || null,
        status: data.status,
        category_id: data.category_id || null,
        tags: data.tags || [],
      };

      if (!payload.title) throw new Error("Judul wajib diisi");
      if (!payload.slug) throw new Error("Slug wajib diisi");

      // atur published_at otomatis kalau status publish
      const nowISO = new Date().toISOString();
      if (payload.status === "published")
        (payload as any).published_at = nowISO;
      else (payload as any).published_at = null;

      if (id) {
        await updateNews(id, payload);
        addToast("Berita berhasil diperbarui");
      } else {
        await createNews(payload);
        addToast(`Berita berhasil dibuat (status: ${payload.status})`);
      }
      setDirty(false);
      nav("/admin/berita");
    } catch (err: any) {
      addToast(err?.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  const publicUrl = data.slug ? `/berita/${data.slug}` : "#";

  return (
    <AdminOnly>
      <Section title={id ? "Edit Berita" : "Tambah Berita"}>
        <form
          onSubmit={onSubmit}
          className="space-y-5 bg-white border rounded-xl p-4 md:p-6"
          onChange={() => setDirty(true)}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Judul *</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    title: e.target.value,
                    slug: d.slug || toSlug(e.target.value),
                  }))
                }
                placeholder="Judul berita"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={data.slug}
                onChange={(e) =>
                  setData((d) => ({ ...d, slug: toSlug(e.target.value) }))
                }
                placeholder="slug-otomatis-dari-judul"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={data.date}
                onChange={(e) =>
                  setData((d) => ({ ...d, date: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="category">Kategori</Label>
              <select
                id="category"
                value={data.category_id || ""}
                onChange={(e) =>
                  setData((d) => ({ ...d, category_id: e.target.value || "" }))
                }
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">Pilih kategori…</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={data.status}
                onChange={(e) =>
                  setData((d) => ({ ...d, status: e.target.value as any }))
                }
                className="w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="excerpt">Ringkasan</Label>
            <Input
              id="excerpt"
              value={data.excerpt}
              onChange={(e) =>
                setData((d) => ({ ...d, excerpt: e.target.value }))
              }
              placeholder="Ringkasan singkat"
            />
          </div>

          <div>
            <Label>Isi (Markdown)</Label>
            <MarkdownEditor
              value={data.content || ""}
              onChange={(v) => setData((d) => ({ ...d, content: v }))}
              rows={14}
            />
          </div>

          <div>
            <Label>Tags</Label>
            <TagsInput
              value={data.tags}
              onChange={(v) => setData((d) => ({ ...d, tags: v }))}
              placeholder="Mis. sekolah, lomba, prestasi"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Cover</Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    cover_file: e.target.files?.[0] ?? null,
                  }))
                }
                className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:bg-slate-50 file:px-3 file:py-2"
              />
              {data.cover_url && (
                <img
                  src={data.cover_url}
                  alt="cover"
                  className="mt-3 h-28 w-48 object-cover rounded-lg border"
                />
              )}
            </div>
            <div className="self-end text-sm text-slate-500">
              * Gunakan gambar horizontal agar tampilan lebih rapi.
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan…" : "Simpan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => nav("/admin/berita")}
            >
              Batal
            </Button>
            {data.status === "published" && data.slug && (
              <Link to={publicUrl} target="_blank">
                <Button type="button" variant="outline">
                  Lihat Halaman
                </Button>
              </Link>
            )}
          </div>
        </form>
      </Section>
    </AdminOnly>
  );
}
