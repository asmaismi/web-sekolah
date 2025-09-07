// src/pages/Galeri.tsx  (PUBLIK, read-only)
import { useEffect, useMemo, useState } from "react";
import Section from "../components/common/Section";

// sesuaikan tipe dengan mock kamu
type GalleryItem = { id: string; url?: string | null; caption?: string | null };

export default function Galeri() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    let ok = true;
    import("../mock/service")
      .then((m) => m.mockApi?.listGallery?.() ?? [])
      .then((res: GalleryItem[]) => {
        if (ok) setItems(res || []);
      });
    return () => {
      ok = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return !s
      ? items
      : items.filter((g) => (g.caption || "").toLowerCase().includes(s));
  }, [items, q]);

  return (
    <Section title="Galeri" subtitle="Dokumentasi kegiatan & momen di sekolah.">
      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari caption…"
          className="w-64 rounded-xl border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="p-6 bg-white border rounded-2xl text-slate-500">
          Belum ada gambar.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((g) => (
            <figure
              key={g.id}
              className="bg-white border rounded-2xl overflow-hidden"
            >
              {g.url ? (
                <img
                  src={g.url}
                  alt={g.caption || ""}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square bg-slate-200" />
              )}
              {g.caption && (
                <figcaption className="p-3 text-sm text-slate-700">
                  {g.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </Section>
  );
}
