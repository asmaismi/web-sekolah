import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Section from "../../components/common/Section";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import useUI from "../../store/ui";
import { uploadImage } from "../../lib/upload";
import {
  createEvent,
  getEventById,
  updateEvent,
  slugify,
  type EventRecord,
  type EventInput,
} from "../../services/events";
import MarkdownEditor from "../../components/form/MarkdownEditor";
import AdminOnly from "../../components/admin/AdminOnly";

type Form = {
  title: string;
  slug: string;
  description?: string;
  location?: string;
  start_at?: string; // 'YYYY-MM-DDTHH:mm' for datetime-local
  end_at?: string;
  cover_url?: string | null;
  cover_file?: File | null;
  status: "draft" | "published";
};

export default function AcaraForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const addToast = useUI((s) => s.add);

  const [data, setData] = useState<Form>({
    title: "",
    slug: "",
    description: "",
    location: "",
    start_at: "",
    end_at: "",
    cover_url: null,
    cover_file: null,
    status: "draft",
  });
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const row: EventRecord = await getEventById(id);
        setData({
          title: row.title ?? "",
          slug: row.slug ?? "",
          description: row.description ?? "",
          location: row.location ?? "",
          start_at: row.start_at
            ? new Date(row.start_at).toISOString().slice(0, 16)
            : "",
          end_at: row.end_at
            ? new Date(row.end_at).toISOString().slice(0, 16)
            : "",
          cover_url: row.cover_url ?? null,
          cover_file: null,
          status: row.status ?? "draft",
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

      const payload: EventInput = {
        title: data.title.trim(),
        slug: (data.slug.trim() || toSlug(data.title)).trim(),
        description: data.description?.trim() || "",
        location: data.location?.trim() || "",
        start_at: data.start_at ? new Date(data.start_at).toISOString() : "",
        end_at: data.end_at ? new Date(data.end_at).toISOString() : null,
        cover_url: cover_url || null,
        status: data.status,
      };

      if (!payload.title) throw new Error("Judul wajib diisi");
      if (!payload.slug) throw new Error("Slug wajib diisi");
      if (!payload.start_at) throw new Error("Tanggal mulai wajib diisi");

      const nowISO = new Date().toISOString();
      (payload as any).published_at =
        data.status === "published" ? nowISO : null;

      if (id) {
        await updateEvent(id, payload);
        addToast("Acara diperbarui");
      } else {
        await createEvent(payload);
        addToast(`Acara dibuat (status: ${data.status})`);
      }
      setDirty(false);
      nav("/admin/acara");
    } catch (err: any) {
      addToast(err?.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminOnly>
      <Section title={id ? "Edit Acara" : "Tambah Acara"}>
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
                placeholder="Contoh: Rapat Orang Tua Murid"
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
                placeholder="rapat-orang-tua-murid"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="start_at">Mulai *</Label>
              <Input
                id="start_at"
                type="datetime-local"
                value={data.start_at}
                onChange={(e) =>
                  setData((d) => ({ ...d, start_at: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="end_at">Selesai</Label>
              <Input
                id="end_at"
                type="datetime-local"
                value={data.end_at}
                onChange={(e) =>
                  setData((d) => ({ ...d, end_at: e.target.value }))
                }
              />
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

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="location">Lokasi</Label>
              <Input
                id="location"
                value={data.location}
                onChange={(e) =>
                  setData((d) => ({ ...d, location: e.target.value }))
                }
                placeholder="Aula, Lapangan, Zoom, dst."
              />
            </div>
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
          </div>

          <div>
            <Label>Deskripsi</Label>
            <MarkdownEditor
              value={data.description || ""}
              onChange={(v) => setData((d) => ({ ...d, description: v }))}
              rows={12}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan…" : "Simpan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => nav("/admin/acara")}
            >
              Batal
            </Button>
          </div>
        </form>
      </Section>
    </AdminOnly>
  );
}
