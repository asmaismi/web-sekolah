import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabase";
import { CalendarDays, MapPin, Search } from "lucide-react";

type EventRow = {
  id: string;
  title: string;
  slug?: string | null;
  description?: string | null;
  start_at: string;
  end_at?: string | null;
  location?: string | null;
  cover_url?: string | null;
  status?: string | null;
};

const PAGE_SIZE = 12;
const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MEI",
  "JUN",
  "JUL",
  "AGU",
  "SEP",
  "OKT",
  "NOV",
  "DES",
] as const;

// palet aksen untuk ring/gradien kartu (berputar)
const RINGS = [
  "from-sky-400 to-cyan-500",
  "from-violet-500 to-fuchsia-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
] as const;

function fmtDate(d: Date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}
function fmtTimeRange(a: Date, b?: Date | null) {
  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (!b) return time.format(a);
  const sameDay = a.toDateString() === b.toDateString();
  return sameDay
    ? `${time.format(a)} – ${time.format(b)}`
    : `${fmtDate(a)} • ${time.format(a)} — ${fmtDate(b)} • ${time.format(b)}`;
}

export default function Agenda() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);

  async function load() {
    setLoading(true);
    try {
      let query = supabase
        .from("events")
        .select(
          "id,title,slug,description,start_at,end_at,location,cover_url,status",
        )
        .order("start_at", { ascending: true });

      const term = q.trim();
      if (term)
        query = query.or(`title.ilike.%${term}%,location.ilike.%${term}%`);

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error } = await query.range(from, to);
      if (error) throw error;

      setRows(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [q, page]);

  const now = new Date();
  const grouped = useMemo(() => {
    const upcoming: EventRow[] = [];
    const past: EventRow[] = [];
    for (const r of rows) {
      const start = new Date(r.start_at);
      const end = r.end_at ? new Date(r.end_at) : null;
      const done = (end ?? start) < now;
      (done ? past : upcoming).push(r);
    }
    return { upcoming, past };
  }, [rows]);

  return (
    <Container>
      {/* Header */}
      <header className="my-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">Agenda</h1>
        <p className="mt-2 text-slate-600">
          Jadwal kegiatan terbaru dan mendatang.
        </p>
      </header>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <Search size={18} />
          </span>
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Cari agenda..."
            className="w-full rounded-xl border bg-white pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>
      </div>

      {/* UPCOMING */}
      <SectionTitle label="Akan Datang" />
      {loading ? (
        <SkeletonGrid />
      ) : grouped.upcoming.length === 0 ? (
        <Empty
          text={q ? "Agenda tidak ditemukan." : "Belum ada agenda mendatang."}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.upcoming.map((ev, i) => (
            <li key={ev.id}>
              <EventCard ev={ev} accentIndex={i} />
            </li>
          ))}
        </ul>
      )}

      {/* PAST */}
      <div className="mt-10" />
      <SectionTitle label="Selesai" />
      {loading ? (
        <SkeletonGrid />
      ) : grouped.past.length === 0 ? (
        <Empty text="Belum ada agenda yang selesai." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grouped.past.map((ev, i) => (
            <li key={ev.id}>
              <EventCard ev={ev} accentIndex={i} />
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          className="rounded-xl border bg-white px-3 py-2 text-sm disabled:opacity-40"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Sebelumnya
        </button>
        <span className="text-xs text-slate-500">Halaman {page}</span>
        <button
          className="rounded-xl border bg-white px-3 py-2 text-sm disabled:opacity-40"
          onClick={() => setPage((p) => p + 1)}
          disabled={rows.length < PAGE_SIZE}
        >
          Berikutnya
        </button>
      </div>

      <div className="mb-4" />
    </Container>
  );
}

/* ================== Components ================== */

function EventCard({ ev, accentIndex }: { ev: EventRow; accentIndex: number }) {
  const start = new Date(ev.start_at);
  const end = ev.end_at ? new Date(ev.end_at) : null;
  const m = MONTHS[start.getMonth()];
  const d = start.getDate();
  const ring = RINGS[accentIndex % RINGS.length];
  const href = `/agenda/${ev.slug || ev.id}`;

  return (
    <Link
      to={href}
      className={`block rounded-2xl p-[1.5px] bg-gradient-to-br ${ring} hover:shadow-lg transition`}
    >
      <article className="rounded-2xl bg-white overflow-hidden">
        {/* Cover + date badge */}
        <div className="relative">
          <div className="aspect-[16/9] bg-slate-100">
            {ev.cover_url ? (
              // eslint-disable-next-line jsx-a11y/alt-text
              <img src={ev.cover_url} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-xs text-slate-400">
                No Cover
              </div>
            )}
          </div>
          <div
            className={`absolute left-3 top-3 w-14 rounded-xl p-[1.5px] bg-gradient-to-br ${ring}`}
          >
            <div className="rounded-xl bg-white grid place-items-center px-2 py-1">
              <div className="text-[10px] font-semibold tracking-wide text-slate-500">
                {m}
              </div>
              <div className="text-xl font-extrabold leading-none">{d}</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start gap-2">
            <h3 className="flex-1 text-base font-semibold text-slate-900 line-clamp-2">
              {ev.title}
            </h3>
            {ev.status && (
              <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
                {ev.status}
              </span>
            )}
          </div>

          {/* meta */}
          <div className="mt-2 grid gap-1 text-[13px] text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={16} className="text-slate-500" />
              <span>
                {fmtDate(start)} • {fmtTimeRange(start, end)}
              </span>
            </span>
            {ev.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={16} className="text-slate-500" />
                <span>{ev.location}</span>
              </span>
            )}
          </div>

          {/* description */}
          {ev.description && (
            <p className="mt-2 text-sm text-slate-700 line-clamp-3">
              {ev.description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-slate-900" />
      <h2 className="text-sm font-semibold text-slate-900">{label}</h2>
      <div className="h-px flex-1 bg-gradient-to-r from-slate-300 to-transparent" />
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border bg-white p-6 text-center text-slate-500">
      {text}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <li
          key={i}
          className="rounded-2xl p-[1.5px] bg-gradient-to-br from-slate-200 to-slate-100"
        >
          <div className="rounded-2xl bg-white overflow-hidden">
            <div className="h-32 bg-slate-100" />
            <div className="p-4 space-y-2">
              <div className="h-4 w-3/5 rounded bg-slate-100" />
              <div className="h-3 w-4/5 rounded bg-slate-100" />
              <div className="h-3 w-2/3 rounded bg-slate-100" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
