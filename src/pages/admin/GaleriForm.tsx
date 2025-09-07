import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Section from "../../components/common/Section";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { uploadImage } from "../../lib/upload";
import useUI from "../../store/ui";
import {
  createGallery,
  getGalleryById,
  updateGallery,
  type GalleryItem,
} from "../../services/gallery";
import AdminOnly from "../../components/admin/AdminOnly";

type Form = {
  title: string;
  caption?: string;
  url?: string | null;
  file?: File | null;
};

export default function GaleriForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const addToast = useUI((s) => s.add);

  const [data, setData] = useState<Form>({
    title: "",
    caption: "",
    url: null,
    file: null,
  });
  const [loading, setLoading] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const row: GalleryItem = await getGalleryById(id);
        setData({
          title: row.title ?? "",
          caption: row.caption ?? "",
          url: row.url ?? null,
          file: null,
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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      let url = data.url || undefined;
      if (data.file) {
        try {
          url = await uploadImage(data.file);
        } catch (err: unknown) {
          addToast(err instanceof Error ? err.message : "Upload gagal");
          setLoading(false);
          return;
        }
      }
      const payload = {
        title: data.title.trim(),
        caption: data.caption?.trim() || "",
        url: url!,
      };
      if (!payload.title) throw new Error("Judul wajib diisi");
      if (!payload.url) throw new Error("Gambar wajib diupload");

      if (id) {
        await updateGallery(id, payload);
        addToast("Berhasil diperbarui");
      } else {
        await createGallery(payload);
        addToast("Berhasil ditambahkan");
      }
      setDirty(false);
      nav("/admin/galeri");
    } catch (e: any) {
      addToast(e?.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminOnly>
      <Section title={id ? "Edit Foto" : "Tambah Foto"}>
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
                  setData((d) => ({ ...d, title: e.target.value }))
                }
                placeholder="Judul foto"
              />
            </div>
            <div>
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={data.caption}
                onChange={(e) =>
                  setData((d) => ({ ...d, caption: e.target.value }))
                }
                placeholder="Keterangan singkat"
              />
            </div>
          </div>

          <div>
            <Label>Gambar *</Label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setData((d) => ({ ...d, file: e.target.files?.[0] ?? null }))
              }
              className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:bg-slate-50 file:px-3 file:py-2"
            />
            {data.url && (
              <img
                src={data.url}
                alt="preview"
                className="mt-3 h-40 w-64 object-cover rounded-lg border"
              />
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan…" : "Simpan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => nav("/admin/galeri")}
            >
              Batal
            </Button>
          </div>
        </form>
      </Section>
    </AdminOnly>
  );
}
