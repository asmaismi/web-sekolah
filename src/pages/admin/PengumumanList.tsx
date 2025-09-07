import { useEffect, useState } from "react";
import Section from "../../components/common/Section";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import useUI from "../../store/ui";
import { Link } from "react-router-dom";
import AdminOnly from "../../components/admin/AdminOnly";
import {
  listAnnouncements,
  deleteAnnouncement,
  setAnnPublish,
  type Announcement,
} from "../../services/announcements";

export default function PengumumanList() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "draft" | "published">("all");
  const [loading, setLoading] = useState(false);
  const addToast = useUI((s) => s.add);

  async function load() {
    setLoading(true);
    try {
      const rows = await listAnnouncements({
        q,
        status,
        order: "created_at",
        ascending: false,
      });
      setItems(rows);
    } catch (e: any) {
      addToast(e?.message || "Gagal memuat");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load(); /* eslint-disable */
  }, [q, status]);

  return (
    <AdminOnly>
      <Section title="Pengumuman">
        <div className="flex items-center gap-3 mb-4">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari judul…"
            className="w-64"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="all">Semua Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
          <div className="ml-auto">
            <Link to="/admin/pengumuman/tambah">
              <Button>Tambah</Button>
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-3 text-left">Judul</th>
                <th className="p-3 w-40 text-left">Aktif</th>
                <th className="p-3 w-24 text-left">Pinned</th>
                <th className="p-3 w-28 text-left">Status</th>
                <th className="p-3 w-56"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={5}>
                    Memuat…
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={5}>
                    Belum ada data.
                  </td>
                </tr>
              ) : (
                items.map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="p-3 font-medium">{it.title}</td>
                    <td className="p-3 text-sm text-slate-600">
                      {(it.active_from
                        ? new Date(it.active_from).toLocaleDateString()
                        : "-") +
                        " — " +
                        (it.active_to
                          ? new Date(it.active_to).toLocaleDateString()
                          : "-")}
                    </td>
                    <td className="p-3">{it.pinned ? "Ya" : "Tidak"}</td>
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
                      <div className="flex justify-end gap-2">
                        <Link to={`/admin/pengumuman/${it.id}/edit`}>
                          <Button variant="outline">Edit</Button>
                        </Link>
                        {it.status === "published" ? (
                          <Button
                            variant="outline"
                            onClick={async () => {
                              try {
                                await setAnnPublish(it.id, false);
                                addToast("Dipindah ke Draft");
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
                                await setAnnPublish(it.id, true);
                                addToast("Dipublish");
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
                            if (!confirm("Hapus pengumuman ini?")) return;
                            try {
                              await deleteAnnouncement(it.id);
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
