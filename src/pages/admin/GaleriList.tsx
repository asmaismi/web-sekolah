import { Link, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import Section from "../../components/common/Section";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import useUI from "../../store/ui";
import {
  listGallery,
  deleteGallery,
  type GalleryItem,
} from "../../services/gallery";
import AdminOnly from "../../components/admin/AdminOnly";

export default function GaleriList() {
  const nav = useNavigate();
  const addToast = useUI((s) => s.add);

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 12;
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const rows = await listGallery({ q });
      setItems(rows);
    } catch (e: any) {
      addToast(e?.message || "Gagal memuat");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [q]);

  const filtered = useMemo(() => items, [items]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <AdminOnly>
      <Section title="Galeri">
        <div className="flex items-center gap-3 mb-4">
          <Input
            value={q}
            placeholder="Cari judul foto…"
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />
          <div className="ml-auto flex items-center gap-2">
            <Button onClick={() => nav("/admin/galeri/tambah")}>Tambah</Button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 bg-white border rounded-xl">Memuat…</div>
        ) : paged.length === 0 ? (
          <div className="p-6 bg-white border rounded-xl text-slate-500">
            Belum ada foto.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {paged.map((it) => (
              <div
                key={it.id}
                className="border rounded-xl overflow-hidden bg-white"
              >
                <img
                  src={it.url}
                  alt={it.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-3">
                  <div className="font-medium text-sm">{it.title}</div>
                  <div className="text-xs text-slate-500 truncate">
                    {new Date(it.created_at).toLocaleString()}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Link to={`/admin/galeri/${it.id}/edit`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={async () => {
                        if (!confirm("Hapus foto ini?")) return;
                        try {
                          await deleteGallery(it.id);
                          addToast("Berhasil dihapus");
                          load();
                        } catch (e: any) {
                          addToast(e?.message || "Gagal hapus");
                        }
                      }}
                    >
                      Hapus
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <div className="text-sm">
              Hal {page} / {totalPages}
            </div>
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </Section>
    </AdminOnly>
  );
}
