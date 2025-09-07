import { useEffect, useState } from "react";
import Section from "../../components/common/Section";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import useUI from "../../store/ui";
import {
  listCategories,
  deleteCategory,
  type Category,
} from "../../services/categories";
import { Link } from "react-router-dom";
import AdminOnly from "../../components/admin/AdminOnly";

export default function KategoriList() {
  const [items, setItems] = useState<Category[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const addToast = useUI((s) => s.add);

  async function load() {
    setLoading(true);
    try {
      const rows = await listCategories();
      setItems(rows);
    } catch (e: any) {
      addToast(e?.message || "Gagal memuat kategori");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, []);

  const filtered = items.filter(
    (c) =>
      !q ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.slug.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AdminOnly>
      <Section title="Kategori">
        <div className="flex items-center gap-3 mb-4">
          <Input
            value={q}
            placeholder="Cari nama/slug…"
            onChange={(e) => setQ(e.target.value)}
            className="w-64"
          />
          <div className="ml-auto">
            <Link to="/admin/kategori/tambah">
              <Button>Tambah</Button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="p-3">Nama</th>
                <th className="p-3">Slug</th>
                <th className="p-3 w-40"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={3}>
                    Memuat…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={3}>
                    Belum ada data.
                  </td>
                </tr>
              ) : (
                filtered.map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="p-3 font-medium">{it.name}</td>
                    <td className="p-3 text-slate-600">{it.slug}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/kategori/${it.id}/edit`}>
                          <Button variant="outline">Edit</Button>
                        </Link>
                        <Button
                          variant="danger"
                          onClick={async () => {
                            if (!confirm("Hapus kategori ini?")) return;
                            try {
                              await deleteCategory(it.id);
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </AdminOnly>
  );
}
