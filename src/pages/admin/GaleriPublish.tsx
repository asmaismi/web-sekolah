import { useEffect, useState } from "react";
import AdminOnly from "@/components/admin/AdminOnly";
import Section from "@/components/common/Section";
import Button from "@/components/ui/Button";
import useUI from "@/store/ui";
import {
  listAllGallery,
  togglePublish,
  type GalleryItem,
} from "@/services/gallery";

export default function GaleriPublish() {
  const toast = useUI((s) => s.add);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<GalleryItem[]>([]);

  async function load() {
    setLoading(true);
    try {
      const rows = await listAllGallery();
      setItems(rows);
    } catch (e: any) {
      toast(e?.message || "Gagal memuat galeri");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onToggle(id: string, val: boolean) {
    try {
      await togglePublish(id, val);
      setItems((xs) =>
        xs.map((x) => (x.id === id ? { ...x, is_published: val } : x)),
      );
      toast(val ? "Dipublish ke beranda" : "Ditarik dari beranda");
    } catch (e: any) {
      toast(e?.message || "Gagal mengubah status");
    }
  }

  return (
    <AdminOnly>
      <Section
        title="Galeri — Publish ke Beranda"
        subtitle="Pilih foto yang tampil di halaman depan."
      >
        {loading ? (
          <div className="text-slate-500">Memuat…</div>
        ) : items.length === 0 ? (
          <div className="text-slate-500">Belum ada item galeri.</div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((it) => (
              <li
                key={it.id}
                className="rounded-2xl border bg-white overflow-hidden"
              >
                <div className="aspect-[16/10] bg-slate-100">
                  {it.image_url ? (
                    <img
                      src={it.image_url}
                      alt={it.title ?? ""}
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
                <div className="p-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-medium truncate">
                      {it.title || "Foto"}
                    </div>
                    {it.is_published ? (
                      <div className="text-[11px] text-emerald-600 font-semibold">
                        PUBLISHED
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-500">Draft</div>
                    )}
                  </div>
                  <Button
                    size="sm"
                    variant={it.is_published ? "outline" : "primary"}
                    onClick={() => onToggle(it.id, !it.is_published)}
                  >
                    {it.is_published ? "Unpublish" : "Publish"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </AdminOnly>
  );
}
