import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "@/components/common/Container";
import Input from "@/components/ui/Input";
import { listNews, type NewsRecord } from "@/services/news";

const RINGS = [
  "from-sky-400 to-cyan-500",
  "from-violet-500 to-fuchsia-500",
  "from-emerald-500 to-teal-500",
  "from-amber-500 to-orange-500",
] as const;

function fmtDate(v?: string | null) {
  if (!v) return "";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(v));
}

function Card({ it, i }: { it: NewsRecord; i: number }) {
  const ring = RINGS[i % RINGS.length];
  const date = fmtDate(it.published_at || (it as any).date);

  return (
    <article
      className={`rounded-2xl p-[1.5px] bg-gradient-to-br ${ring} hover:shadow-lg transition`}
    >
      <div className="rounded-2xl bg-white overflow-hidden h-full flex flex-col">
        {/* Cover */}
        <div className="aspect-[16/9] bg-slate-100">
          {it.cover_url ? (
            <img
              src={it.cover_url}
              alt={it.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-slate-400">
              No cover
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex-1 flex flex-col">
          <h2 className="text-base font-semibold text-slate-900 line-clamp-2">
            <Link to={`/berita/${it.slug}`} className="hover:underline">
              {it.title}
            </Link>
          </h2>

          <div className="mt-1 text-xs text-slate-500">{date}</div>

          {it.excerpt && (
            <p className="mt-2 text-sm text-slate-700 line-clamp-3">
              {it.excerpt}
            </p>
          )}

          <div className="mt-3">
            <Link
              to={`/berita/${it.slug}`}
              className="text-sm text-primary-600 hover:underline"
            >
              Baca selengkapnya →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard({ i }: { i: number }) {
  return (
    <div className="rounded-2xl p-[1.5px] bg-gradient-to-br from-slate-200 to-slate-100">
      <div className="rounded-2xl bg-white overflow-hidden">
        <div className="aspect-[16/9] bg-slate-100" />
        <div className="p-4 space-y-2">
          <div className="h-4 w-3/5 rounded bg-slate-100" />
          <div className="h-3 w-2/5 rounded bg-slate-100" />
          <div className="h-3 w-4/5 rounded bg-slate-100" />
        </div>
      </div>
    </div>
  );
}

export default function BeritaList() {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NewsRecord[]>([]);

  async function load() {
    setLoading(true);
    try {
      // Publik → ambil yang Published saja
      const rows = await listNews({
        q,
        status: "published",
        order: "published_at",
        ascending: false,
      });
      setItems(rows);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <Container>
      <header className="my-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">Berita</h1>
        <p className="mt-2 text-slate-600">
          Kumpulan kabar terbaru dari sekolah.
        </p>
      </header>

      {/* Search */}
      <div className="mb-6">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Cari berita…"
          className="w-full sm:w-80"
        />
      </div>

      {loading ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <SkeletonCard i={i} />
            </li>
          ))}
        </ul>
      ) : items.length === 0 ? (
        <div className="text-slate-500">Belum ada berita.</div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <li key={it.id}>
              <Card it={it} i={i} />
            </li>
          ))}
        </ul>
      )}

      <div className="mb-6" />
    </Container>
  );
}
