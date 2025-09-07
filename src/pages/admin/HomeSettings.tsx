import { useEffect, useRef, useState, FormEvent } from "react";
import AdminOnly from "@/components/admin/AdminOnly";
import Section from "@/components/common/Section";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import useUI from "@/store/ui";

import {
  getSettings,
  updateSettings,
  type SiteSettings,
} from "@/services/settings";

import { supabase } from "@/lib/supabase";
import { Image as ImageIcon, Trash2, UploadCloud } from "lucide-react";
import { useSettings } from "@/store/settings";

const BUCKET = "images"; // ganti jika bucket storage-mu bernama lain

export default function HomeSettings() {
  const toast = useUI((s) => s.add);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [f, setF] = useState<Partial<SiteSettings>>({});
  const refreshSettings = useSettings((s) => s.refresh);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getSettings();
        if (!alive) return;
        setF({ home_layout: data.home_layout ?? "classic", ...data });
      } catch (e: any) {
        toast(e?.message || "Gagal memuat");
      }
    })();
    return () => {
      alive = false;
    };
  }, [toast]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSettings({
        home_show_welcome: !!f.home_show_welcome,
        home_welcome_title: f.home_welcome_title ?? null,
        home_welcome_body: f.home_welcome_body ?? null,
        home_welcome_image_url: f.home_welcome_image_url ?? null,
        home_principal_name: f.home_principal_name ?? null,
        home_show_gallery: !!f.home_show_gallery,
        home_gallery_limit: Number(f.home_gallery_limit || 8),
        home_layout: (f.home_layout as string) ?? "classic",
      });

      // refresh store supaya Home langsung baca versi terbaru
      await refreshSettings();
      toast("Homepage disimpan");
    } catch (e: any) {
      toast(e?.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/")) {
      toast("File bukan gambar");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast("Ukuran maks 2MB");
      return;
    }

    setUploading(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `settings/headmaster-${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type });
      if (error) throw error;

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const url = pub?.publicUrl;
      if (!url) throw new Error("Gagal mendapatkan public URL");

      setF((v) => ({ ...v, home_welcome_image_url: url }));
      toast("Foto berhasil diunggah. Jangan lupa klik Simpan.");
    } catch (e: any) {
      toast(e?.message || "Upload gagal");
    } finally {
      setUploading(false);
    }
  }

  function onPickFile() {
    fileRef.current?.click();
  }

  function onRemoveImage() {
    setF((v) => ({ ...v, home_welcome_image_url: null as any }));
  }

  return (
    <AdminOnly>
      <Section
        title="Homepage"
        subtitle="Kontrol konten yang ditampilkan di halaman depan."
      >
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2 bg-white border rounded-xl p-4">
            <div className="font-semibold">Layout Beranda</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { key: "classic", label: "Klasik (Foto kiri)" },
                { key: "headline", label: "Headline (Foto atas)" },
              ].map((opt) => (
                <label
                  key={opt.key}
                  className={`cursor-pointer rounded-xl border p-3 flex items-center gap-3 ${
                    f.home_layout === opt.key
                      ? "ring-2 ring-primary-500 border-primary-200"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="home_layout"
                    className="mr-2"
                    checked={f.home_layout === opt.key}
                    onChange={() =>
                      setF((v) => ({ ...v, home_layout: opt.key as any }))
                    }
                  />
                  <div>
                    <div className="font-medium">{opt.label}</div>
                    <div className="text-xs text-slate-500">
                      Klik untuk memilih
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          {/* SAMBUTAN / WELCOME */}
          <div className="space-y-4 bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Sambutan Kepala Sekolah</div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!f.home_show_welcome}
                  onChange={(e) =>
                    setF((v) => ({ ...v, home_show_welcome: e.target.checked }))
                  }
                />
                Tampilkan
              </label>
            </div>

            <div>
              <Label>Judul</Label>
              <Input
                value={f.home_welcome_title || ""}
                onChange={(e) =>
                  setF((v) => ({ ...v, home_welcome_title: e.target.value }))
                }
              />
            </div>

            <div>
              <Label>Isi / Sambutan</Label>
              <Textarea
                rows={6}
                value={f.home_welcome_body || ""}
                onChange={(e) =>
                  setF((v) => ({ ...v, home_welcome_body: e.target.value }))
                }
              />
            </div>

            {/* FOTO KEPSEK */}
            <div>
              <Label>Foto Kepala Sekolah</Label>
              <div className="flex items-center gap-4">
                {f.home_welcome_image_url ? (
                  <img
                    src={f.home_welcome_image_url}
                    alt="Kepala Sekolah"
                    className="h-20 w-20 rounded-xl object-cover border"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-20 w-20 rounded-xl border grid place-items-center text-slate-400">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onPickFile}
                    disabled={uploading}
                  >
                    <UploadCloud className="h-4 w-4 mr-2" />
                    {uploading ? "Mengunggah…" : "Upload / Ganti"}
                  </Button>

                  {f.home_welcome_image_url ? (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={onRemoveImage}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Hapus
                    </Button>
                  ) : null}
                </div>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const input = e.target as HTMLInputElement; // cast aman
                  const file = input.files?.[0];
                  if (file) uploadImage(file);
                  input.value = ""; // reset agar bisa upload file yang sama lagi
                }}
              />
              <p className="mt-1 text-xs text-slate-500">
                PNG/JPG, maks 2MB. Setelah upload, klik <b>Simpan</b>.
              </p>
            </div>
            <div className="mt-4">
              <Label>Nama Kepala Sekolah</Label>
              <Input
                placeholder="Misal: Ahmad Sudirman, S.Pd."
                value={(f.home_principal_name as string) || ""}
                onChange={(e) =>
                  setF((v) => ({ ...v, home_principal_name: e.target.value }))
                }
              />
              <p className="text-xs text-slate-500 mt-1">
                Opsional. Jika diisi, akan ditampilkan sebagai tanda tangan di
                bawah sambutan.
              </p>
            </div>
            <div className="pt-2">
              <Button type="submit" disabled={loading || uploading}>
                {loading ? "Menyimpan…" : "Simpan"}
              </Button>
            </div>
          </div>

          {/* GALERI BERANDA */}
          <div className="space-y-4 bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold">Galeri di Beranda</div>
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!!f.home_show_gallery}
                  onChange={(e) =>
                    setF((v) => ({ ...v, home_show_gallery: e.target.checked }))
                  }
                />
                Tampilkan
              </label>
            </div>

            <div>
              <Label>Jumlah foto ditampilkan</Label>
              <Input
                type="number"
                min={3}
                max={24}
                value={(f.home_gallery_limit ?? 8).toString()}
                onChange={(e) =>
                  setF((v) => ({
                    ...v,
                    home_gallery_limit: Number(e.target.value),
                  }))
                }
              />
            </div>

            <p className="text-sm text-slate-600">
              Foto yang tampil adalah item <b>Galeri</b> dengan status{" "}
              <i>Published</i>. Atur publish/unpublish di menu “Galeri →
              Publish”.
            </p>

            <div className="pt-2">
              <Button type="submit" disabled={loading || uploading}>
                {loading ? "Menyimpan…" : "Simpan"}
              </Button>
            </div>
          </div>
        </form>
      </Section>
    </AdminOnly>
  );
}
