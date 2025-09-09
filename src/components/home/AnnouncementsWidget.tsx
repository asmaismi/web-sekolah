import { useEffect, useState } from "react";
import Section from "@/components/common/Section";
import { listAnnouncements, type Announcement } from "@/services/announcements";
import { Megaphone } from "lucide-react";
import { Link } from "react-router-dom";

function fmtDate(s?: string | null) {
  if (!s) return "";
  try {
    return new Date(s).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return s ?? "";
  }
}

export default function AnnouncementsWidget() {
  const [rows, setRows] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const list = await listAnnouncements({ status: "published", order: "published_at", ascending: false });
        setRows(list.slice(0, 5));
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Section title="Pengumuman" subtitle="Informasi penting untuk siswa & orang tua">
      <div className="rounded-2xl border bg-white p-4 shadow-card">
        {loading ? (
          <div className="text-sm text-slate-500">Memuat…</div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-slate-500">Belum ada pengumuman.</div>
        ) : (
          <ul className="divide-y">
            {rows.map((a) => (
              <li key={a.id} className="py-3">
                <Link to={"/pengumuman"} className="group block">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow">
                      <Megaphone size={16} />
                    </span>
                    <div className="min-w-0">
                      <div className="font-medium group-hover:underline line-clamp-2">{a.title}</div>
                      <div className="text-[11px] text-slate-500">{fmtDate(a.published_at || a.created_at)}</div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 text-right">
          <Link to="/pengumuman" className="text-xs text-brand-600 hover:underline">Lihat semua →</Link>
        </div>
      </div>
    </Section>
  );
}
