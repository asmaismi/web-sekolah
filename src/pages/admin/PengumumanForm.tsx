import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Section from "../../components/common/Section";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import useUI from "../../store/ui";
import {
  createAnnouncement,
  getAnnouncementById,
  updateAnnouncement,
  type Announcement,
} from "../../services/announcements";
import AdminOnly from "../../components/admin/AdminOnly";

type Form = {
  title: string;
  body?: string;
  active_from?: string;
  active_to?: string;
  pinned: boolean;
  status: "draft" | "published";
};

export default function PengumumanForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const addToast = useUI((s) => s.add);

  const [data, setData] = useState<Form>({
    title: "",
    body: "",
    active_from: "",
    active_to: "",
    pinned: false,
    status: "draft",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const row: Announcement = await getAnnouncementById(id);
        setData({
          title: row.title ?? "",
          body: row.body ?? "",
          active_from: row.active_from
            ? new Date(row.active_from).toISOString().slice(0, 10)
            : "",
          active_to: row.active_to
            ? new Date(row.active_to).toISOString().slice(0, 10)
            : "",
          pinned: !!row.pinned,
          status: row.status ?? "draft",
        });
      } catch (e: any) {
        addToast(e?.message || "Gagal memuat data");
      }
    })();
  }, [id]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: data.title.trim(),
        body: (data.body || "").trim(),
        active_from: data.active_from
          ? new Date(data.active_from).toISOString()
          : null,
        active_to: data.active_to
          ? new Date(data.active_to).toISOString()
          : null,
        pinned: !!data.pinned,
        status: data.status,
        // set published_at otomatis
        ...(data.status === "published"
          ? { published_at: new Date().toISOString() }
          : { published_at: null }),
      } as any;

      if (!payload.title) throw new Error("Judul wajib diisi");

      if (id) {
        await updateAnnouncement(id, payload);
        addToast("Pengumuman diperbarui");
      } else {
        await createAnnouncement(payload);
        addToast(`Pengumuman dibuat (status: ${data.status})`);
      }
      nav("/admin/pengumuman");
    } catch (e: any) {
      addToast(e?.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminOnly>
      <Section title={id ? "Edit Pengumuman" : "Tambah Pengumuman"}>
        <form
          onSubmit={onSubmit}
          className="space-y-5 bg-white border rounded-xl p-4 md:p-6"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Judul *</Label>
              <Input
                id="title"
                value={data.title}
                onChange={(e) =>
                  setData((d) => ({ ...d, title: e.target.value }))
                }
                placeholder="Contoh: Libur Akhir Semester"
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

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="active_from">Aktif dari</Label>
              <Input
                id="active_from"
                type="date"
                value={data.active_from}
                onChange={(e) =>
                  setData((d) => ({ ...d, active_from: e.target.value }))
                }
              />
            </div>
            <div>
              <Label htmlFor="active_to">Aktif sampai</Label>
              <Input
                id="active_to"
                type="date"
                value={data.active_to}
                onChange={(e) =>
                  setData((d) => ({ ...d, active_to: e.target.value }))
                }
              />
            </div>
            <div className="flex items-end gap-2">
              <input
                id="pinned"
                type="checkbox"
                checked={data.pinned}
                onChange={(e) =>
                  setData((d) => ({ ...d, pinned: e.target.checked }))
                }
              />
              <Label htmlFor="pinned">Pinned (tampilkan di atas)</Label>
            </div>
          </div>

          <div>
            <Label htmlFor="body">Isi</Label>
            <Textarea
              id="body"
              rows={8}
              value={data.body}
              onChange={(e) => setData((d) => ({ ...d, body: e.target.value }))}
              placeholder="Isi pengumuman…"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan…" : "Simpan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => nav("/admin/pengumuman")}
            >
              Batal
            </Button>
          </div>
        </form>
      </Section>
    </AdminOnly>
  );
}
