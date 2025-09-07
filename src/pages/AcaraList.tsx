import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Section from "../components/common/Section";
import Input from "../components/ui/Input";
import AdminOnly from "../components/admin/AdminOnly";
import { mockApi } from "../mock/service";
import type { Event as AppEvent } from "../mock/types";

export default function AcaraList() {
  const [items, setItems] = useState<AppEvent[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    mockApi.listEvents().then((res: AppEvent[]) => setItems(res || []));
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return !s
      ? items
      : items.filter((e) => (e.title || "").toLowerCase().includes(s));
  }, [items, q]);

  return (
    <AdminOnly>
      <Section title="Acara" subtitle="Kelola jadwal acara.">
        <div className="mb-4">
          <Input
            placeholder="Cari judul…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-64"
          />
        </div>

        <div className="overflow-auto border rounded-2xl bg-white">
          <table className="min-w-[640px] w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500">
                <th className="p-3">Judul</th>
                <th className="p-3 w-40">Tanggal</th>
                <th className="p-3 w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="p-3">{e.title}</td>
                  <td className="p-3">
                    {typeof e.date === "string"
                      ? e.date
                      : new Date(e.date || "").toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <Link
                      to={`/admin/acara/${e.id}/edit`}
                      className="text-brand-700 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="p-6 text-slate-500" colSpan={3}>
                    Belum ada data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Section>
    </AdminOnly>
  );
}
