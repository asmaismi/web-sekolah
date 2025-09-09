import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Newspaper } from "lucide-react";

type NewsRow = {
  id: string;
  title: string | null;
  slug: string | null;
  created_at: string | null;
  published_at: string | null;
  status?: string | null;
};

export default function ArticleListWidget() {
  const [rows, setRows] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("news")
          .select("id,title,slug,created_at,published_at,status")
          .order("published_at", { ascending: false })
          .limit(5);
        if (error) throw error;

        let list = (data || []) as NewsRow[];
        if ((list?.length ?? 0) > 0 && "status" in (list[0] as any)) {
          list = list.filter(
            (r) => (r.status || "").toLowerCase() === "published",
          );
        }
        setRows(list);
      } catch {
        setRows([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="rounded-2xl border bg-white shadow-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow">
          <Newspaper size={16} />
        </span>
        <div>
          <div className="font-semibold leading-tight">Artikel Terbaru</div>
          <div className="text-xs text-slate-500">Update informasi sekolah</div>
        </div>
      </div>

      {loading ? (
        <div className="text-sm text-slate-500">Memuat…</div>
      ) : rows.length === 0 ? (
        <div className="text-sm text-slate-500">Belum ada artikel.</div>
      ) : (
        <ul className="grid gap-3">
          {rows.map((r) => (
            <li key={r.id}>
              <Link
                to={r.slug ? `/berita/${r.slug}` : "/berita"}
                className="group block rounded-xl border hover:bg-slate-50 px-3 py-2"
              >
                <div className="text-sm font-medium text-slate-800 line-clamp-2 group-hover:underline">
                  {r.title || "Tanpa judul"}
                </div>
                <div className="text-[11px] text-slate-500">
                  {r.published_at || r.created_at
                    ? new Date(
                        r.published_at || r.created_at!,
                      ).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : ""}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 text-right">
        <Link to="/berita" className="text-xs text-brand-600 hover:underline">
          Lihat semua →
        </Link>
      </div>
    </div>
  );
}
