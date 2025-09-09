import { useEffect, useState } from "react";
import Section from "@/components/common/Section";
import { supabase } from "@/lib/supabase";
import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

type EventRow = {
  id: string;
  title: string;
  slug?: string | null;
  start_at: string;
  end_at?: string | null;
  location?: string | null;
  status?: string | null;
};

function isUpcoming(e: EventRow) {
  // consider upcoming if start_at today or later
  const now = new Date();
  const start = new Date(e.start_at);
  // normalize time
  start.setHours(0,0,0,0);
  now.setHours(0,0,0,0);
  return start >= now;
}

function fmtDateRange(a?: string, b?: string | null) {
  if (!a) return "";
  const A = new Date(a);
  const B = b ? new Date(b) : null;
  const date = new Intl.DateTimeFormat("id-ID", { weekday: "short", day: "2-digit", month: "long", year: "numeric" });
  const time = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" });
  if (!B) return `${date.format(A)} • ${time.format(A)}`;
  const sameDay = A.toDateString() === B.toDateString();
  return sameDay
    ? `${date.format(A)} • ${time.format(A)} — ${time.format(B)}`
    : `${date.format(A)} • ${time.format(A)} — ${date.format(B)} • ${time.format(B)}`;
}

export default function EventsWidget() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let { data, error } = await supabase
          .from("events")
          .select("id,title,slug,start_at,end_at,location,status")
          .order("start_at", { ascending: true });
        if (error) throw error;
        let list = (data ?? []) as EventRow[];
        // filter only upcoming, and published if column exists
        list = list.filter((e) => isUpcoming(e) && (("status" in e ? (e.status || "").toLowerCase() !== "draft" : true)));
        setRows(list.slice(0, 6));
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Section title="Agenda Terdekat" subtitle="Kegiatan sekolah beberapa waktu ke depan">
      <div className="rounded-2xl border bg-white p-4 shadow-card">
        {loading ? (
          <div className="text-sm text-slate-500">Memuat…</div>
        ) : rows.length === 0 ? (
          <div className="text-sm text-slate-500">Belum ada agenda.</div>
        ) : (
          <ul className="grid gap-3">
            {rows.map((e) => (
              <li key={e.id} className="rounded-xl border p-3 hover:bg-slate-50">
                <Link to={e.slug ? `/agenda/${e.slug}` : "/agenda"} className="block">
                  <div className="font-medium line-clamp-2">{e.title}</div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1"><CalendarDays size={14} /> {fmtDateRange(e.start_at, e.end_at)}</span>
                    {e.location && <span className="inline-flex items-center gap-1"><MapPin size={14} /> {e.location}</span>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 text-right">
          <Link to="/agenda" className="text-xs text-brand-600 hover:underline">Lihat semua →</Link>
        </div>
      </div>
    </Section>
  );
}
