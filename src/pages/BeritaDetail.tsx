import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "@/components/common/Container";
import { getNewsBySlug, type NewsRecord } from "@/services/news";
import { CalendarDays, Clock } from "lucide-react";

function fmtDate(v?: string | null) {
  if (!v) return "";
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(v));
}

function readingTime(text?: string | null) {
  if (!text) return 1;
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200)); // ~200 wpm
}

export default function BeritaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState<NewsRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const row = await getNewsBySlug(slug);
        setItem(row);
      } catch (e: any) {
        setError(e?.message || "Berita tidak ditemukan");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const dateStr = useMemo(
    () => fmtDate(item?.published_at || (item as any)?.date),
    [item],
  );
  const rtime = useMemo(
    () => readingTime(item?.content || item?.excerpt),
    [item?.content, item?.excerpt],
  );

  if (loading) {
    return (
      <Container>
        <div className="my-10 text-slate-500">Memuat…</div>
      </Container>
    );
  }

  if (error || !item) {
    return (
      <Container>
        <div className="my-10">
          <div className="text-xl font-semibold mb-2">
            Berita tidak ditemukan
          </div>
          <Link to="/berita" className="text-primary-600 hover:underline">
            ← Kembali ke daftar berita
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Hero Cover */}
      {item.cover_url && (
        <div className="rounded-2xl overflow-hidden border mb-6">
          <div className="relative aspect-[16/9] bg-slate-100">
            <img
              src={item.cover_url}
              alt={item.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />
          </div>
        </div>
      )}

      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold">{item.title}</h1>

        {/* Meta */}
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-600">
          {dateStr && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={16} className="text-slate-500" />
              <span>{dateStr}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock size={16} className="text-slate-500" />
            <span>{rtime} menit baca</span>
          </span>
        </div>

        {/* Excerpt */}
        {item.excerpt && (
          <p className="mt-4 text-lg text-slate-700">{item.excerpt}</p>
        )}

        {/* Content */}
        {item.content && (
          <div className="prose max-w-none mt-6">
            <div className="whitespace-pre-line">{item.content}</div>
          </div>
        )}

        {/* Back */}
        <div className="mt-10">
          <Link to="/berita" className="text-primary-600 hover:underline">
            ← Kembali ke daftar berita
          </Link>
        </div>
      </article>
    </Container>
  );
}
