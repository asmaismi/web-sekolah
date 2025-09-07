import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Section from "../../components/common/Section";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import useUI from "../../store/ui";
import {
  listNewsPaged,
  setPublish,
  deleteNews,
  type NewsRecord,
} from "../../services/news";
import { listCategories, type Category } from "../../services/categories";
import AdminOnly from "../../components/admin/AdminOnly";

export default function NewsList() {
  const nav = useNavigate();
  const addToast = useUI((s) => s.add);

  const [items, setItems] = useState<NewsRecord[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<string | "">("");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await listNewsPaged({
        q,
        status,
        category_id: categoryId || null,
        page,
        perPage,
        order: "created_at",
        ascending: false,
      });
      setItems(res.items);
      setCount(res.count);
    } catch (e: any) {
      addToast(e?.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }

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
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, status, categoryId, page]);

  const totalPages = Math.max(1, Math.ceil(count / perPage));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const filtered = useMemo(() => items, [items]);

  return (
    <AdminOnly>
      <Section title="Berita">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Input
            value={q}
            placeholder="Cari judul/isi…"
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            className="w-64"
          />
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as any);
              setPage(1);
            }}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="all">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <select
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <div className="ml-auto flex items-center gap-2">
            <Button onClick={() => nav("/admin/berita/tambah")}>Tambah</Button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-3">Judul</th>
                <th className="p-3 w-36">Kategori</th>
                <th className="p-3 w-32">Tanggal</th>
                <th className="p-3 w-28">Status</th>
                <th className="p-3 w-56"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={5}>
                    Memuat…
                  </td>
                </tr>
              )}

              {!loading &&
                filtered.map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="p-3">
                      <div className="font-medium">{it.title}</div>
                      <div className="text-xs text-slate-500 truncate">
                        {it.slug}
                      </div>
                    </td>
                    <td className="p-3">
                      {categories.find((c) => c.id === it.category_id)?.name ||
                        "-"}
                    </td>
                    <td className="p-3">
                      {it.date ? new Date(it.date).toLocaleDateString() : "-"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs ${
                          it.status === "published"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}
                      >
                        {it.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex gap-2 justify-end">
                        <Link to={`/admin/berita/${it.id}/edit`}>
                          <Button variant="outline">Edit</Button>
                        </Link>
                        {it.status === "published" ? (
                          <Button
                            variant="outline"
                            onClick={async () => {
                              try {
                                await setPublish(it.id, false);
                                addToast("Berhasil ubah ke Draft");
                                load();
                              } catch (e: any) {
                                addToast(e?.message || "Gagal");
                              }
                            }}
                          >
                            Unpublish
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            onClick={async () => {
                              try {
                                await setPublish(it.id, true);
                                addToast("Berhasil publish");
                                load();
                              } catch (e: any) {
                                addToast(e?.message || "Gagal");
                              }
                            }}
                          >
                            Publish
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          onClick={async () => {
                            if (!confirm("Hapus berita ini?")) return;
                            try {
                              await deleteNews(it.id);
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
                    </td>
                  </tr>
                ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={5}>
                    Belum ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-center gap-2 mt-4">
          <Button
            variant="outline"
            disabled={!canPrev}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <div className="text-sm">
            Hal {page} / {totalPages}
          </div>
          <Button
            variant="outline"
            disabled={!canNext}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </Section>
    </AdminOnly>
  );
}
