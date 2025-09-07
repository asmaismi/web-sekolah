import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Container from "@/components/common/Container";
import { getEventBySlug, type EventRecord } from "@/services/events";

function fmt(dt?: string | null) {
  return dt ? new Date(dt).toLocaleString() : "";
}

export default function AgendaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState<EventRecord | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const row = await getEventBySlug(slug);
        setItem(row);
      } catch (e: any) {
        setError(e?.message || "Agenda tidak ditemukan");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <Container>
        <div className="text-slate-500 my-10">Memuat…</div>
      </Container>
    );
  }
  if (error || !item) {
    return (
      <Container>
        <div className="my-10">
          <div className="text-xl font-semibold mb-2">
            Agenda tidak ditemukan
          </div>
          <Link to="/agenda" className="text-primary-600 hover:underline">
            ← Kembali ke agenda
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <article className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
        <div className="text-sm text-slate-600 mb-2">
          {fmt(item.start_at)}
          {item.end_at ? ` — ${fmt(item.end_at)}` : ""}
          {item.location ? ` · ${item.location}` : ""}
        </div>

        {item.cover_url && (
          <figure className="rounded-xl border bg-slate-50 overflow-hidden mb-6">
            <img
              src={item.cover_url}
              alt={item.title}
              className="w-full h-auto max-h-[520px] object-contain"
              loading="lazy"
            />
          </figure>
        )}

        {item.description && (
          <div className="prose max-w-none whitespace-pre-line">
            {item.description}
          </div>
        )}

        <div className="mt-8">
          <Link to="/agenda" className="text-primary-600 hover:underline">
            ← Kembali ke agenda
          </Link>
        </div>
      </article>
    </Container>
  );
}
