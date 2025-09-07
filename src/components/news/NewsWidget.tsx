import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Container from "@/components/common/Container";
import { listNews, type NewsRecord } from "@/services/news";

export default function NewsWidget() {
  const [items, setItems] = useState<NewsRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // ambil 3 berita terbaru yang sudah dipublish
        const rows = await listNews({
          status: "published",
          order: "published_at",
          ascending: false,
          limit: 3,
          offset: 0,
        });
        setItems(rows);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="py-10">
      <Container>
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-2xl font-bold">Berita Terbaru</h2>
          <Link
            to="/berita"
            className="text-sm text-primary-600 hover:underline"
          >
            Lihat semua →
          </Link>
        </div>

        {loading ? (
          <div className="text-slate-500">Memuat…</div>
        ) : items.length === 0 ? (
          <div className="text-slate-500">Belum ada berita.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((it) => (
              <article
                key={it.id}
                className="rounded-xl border bg-white overflow-hidden"
              >
                {it.cover_url ? (
                  <img
                    src={it.cover_url}
                    alt={it.title}
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-40 w-full bg-slate-100" />
                )}
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2">
                    <Link to={`/berita/${it.slug}`} className="hover:underline">
                      {it.title}
                    </Link>
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    {it.published_at
                      ? new Date(it.published_at).toLocaleDateString()
                      : it.date
                        ? new Date(it.date).toLocaleDateString()
                        : ""}
                  </div>
                  {it.excerpt && (
                    <p className="text-sm text-slate-600 mt-2 line-clamp-3">
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
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
