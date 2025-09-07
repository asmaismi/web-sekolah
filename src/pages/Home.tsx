import { useEffect, useState, FormEvent } from "react";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button";
import Section from "../components/common/Section";
import {
  Award,
  Users,
  BookOpen,
  Lock,
  Mail,
  KeyRound,
  Newspaper,
} from "lucide-react";
import { useSettings } from "@/store/settings";
import { listHomeGallery, type GalleryItem } from "@/services/gallery";
import { supabase } from "@/lib/supabase";
import {
  WELCOME_LAYOUTS,
  DEFAULT_WELCOME_LAYOUT,
} from "@/layouts/home/registry";
import type { WelcomeLayoutKey } from "@/layouts/home/types";

/** Konversi URL (YouTube/Vimeo/iframe) menjadi src untuk <iframe> */
function getEmbedSrc(
  url?: string | null,
  opts: { autoplay?: boolean; muted?: boolean; loop?: boolean } = {},
) {
  if (!url) return "";
  const a = !!opts.autoplay;
  const m = opts.muted !== false; // default true
  const l = !!opts.loop;
  const u = url.trim();

  const yt = u.match(
    /(?:youtu\.be\/([A-Za-z0-9_-]{6,})|youtube\.com\/(?:watch\?v=|embed\/)([A-Za-z0-9_-]{6,}))/i,
  );
  if (yt) {
    const id = yt[1] || yt[2];
    const q = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      autoplay: a ? "1" : "0",
      mute: m ? "1" : "0",
      loop: l ? "1" : "0",
      playlist: id,
    });
    return `https://www.youtube.com/embed/${id}?${q.toString()}`;
  }

  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm) {
    const id = vm[1];
    const q = new URLSearchParams({
      autoplay: a ? "1" : "0",
      muted: m ? "1" : "0",
      loop: l ? "1" : "0",
      title: "0",
      byline: "0",
      portrait: "0",
    });
    return `https://player.vimeo.com/video/${id}?${q.toString()}`;
  }
  return u;
}

/* -----------------------------
   Widget: Login Guru (UI Only)
-------------------------------- */
function TeacherLoginCard() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    // Saat ini: arahkan ke halaman login (placeholder).
    // Nanti tinggal ganti dengan supabase.auth.signInWithPassword atau endpoint login guru.
    setLoading(true);
    try {
      window.location.href = "/admin/login";
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border bg-white shadow-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow">
          <Lock size={16} />
        </span>
        <div>
          <div className="font-semibold leading-tight">Login Guru</div>
          <div className="text-xs text-slate-500">Akses panel staf</div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-xs font-medium text-slate-600">Email</span>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="guru@sekolah.sch.id"
            />
          </div>
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-medium text-slate-600">Kata Sandi</span>
          <div className="relative">
            <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="password"
              required
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full rounded-xl border px-9 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-300"
              placeholder="••••••••"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 inline-flex h-10 items-center justify-center rounded-xl bg-brand-600 px-4 text-white hover:bg-brand-700 disabled:opacity-60"
        >
          {loading ? "Memproses…" : "Masuk"}
        </button>

        <div className="mt-1 text-right">
          <a
            href="/admin/login"
            className="text-xs text-brand-600 hover:underline"
          >
            Lupa password?
          </a>
        </div>
      </form>
    </div>
  );
}

/* -----------------------------
   Widget: Artikel Terbaru (5)
-------------------------------- */
type NewsRow = {
  id: string;
  title: string | null;
  slug: string | null;
  created_at: string | null;
  published_at: string | null;
  status?: string | null;
};
function ArticleListWidget() {
  const [rows, setRows] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Ambil 5 artikel terbaru. Jika ada kolom status, filter published.
        const { data, error } = await supabase
          .from("news")
          .select("id,title,slug,created_at,published_at,status")
          .order("published_at", { ascending: false })
          .limit(5);
        if (error) throw error;

        // Filter published kalau kolom status ada
        let list = (data || []) as NewsRow[];
        if (list.length && "status" in list[0]) {
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
                  {r.published_at
                    ? new Date(r.published_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : r.created_at
                      ? new Date(r.created_at).toLocaleDateString("id-ID", {
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

/* -----------------------------
   Halaman Utama
-------------------------------- */
export default function Home() {
  const { data: s, refresh } = useSettings();
  const [galeri, setGaleri] = useState<GalleryItem[]>([]);

  const layoutKey: WelcomeLayoutKey =
    (s?.home_layout as WelcomeLayoutKey) ?? DEFAULT_WELCOME_LAYOUT;
  const WelcomeComp =
    WELCOME_LAYOUTS[layoutKey] ?? WELCOME_LAYOUTS[DEFAULT_WELCOME_LAYOUT];

  useEffect(() => {
    void refresh(); // selalu fetch ulang saat Home dibuka
  }, [refresh]);

  useEffect(() => {
    (async () => {
      if (s?.home_show_gallery) {
        const rows = await listHomeGallery(s.home_gallery_limit ?? 8);
        setGaleri(rows);
      } else {
        setGaleri([]);
      }
    })();
  }, [s?.home_show_gallery, s?.home_gallery_limit]);

  const title = s?.hero_title || "Sekolah Modern untuk Masa Depan";
  const subtitle =
    s?.hero_subtitle ||
    "Kurikulum berbasis proyek, fasilitas lengkap, dan pendidik berpengalaman untuk menumbuhkan karakter dan kompetensi abad 21.";
  const btn1Text = s?.hero_btn_text || "Daftar PPDB";
  const btn1Url = s?.hero_btn_url || "/ppdb";
  const btn2Text = s?.hero_btn2_text || "Lihat Berita";
  const btn2Url = s?.hero_btn2_url || "/berita";
  const embedSrc = getEmbedSrc(s?.hero_media_url, {
    autoplay: !!s?.hero_media_autoplay,
    muted: s?.hero_media_muted !== false,
    loop: !!s?.hero_media_loop,
  });

  return (
    <div className="relative">
      {/* Background gradient blur */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-[480px] w-[800px] rounded-full bg-gradient-to-br from-brand-200/60 via-emerald-200/40 to-transparent blur-3xl" />
      </div>

      {/* ===== HERO ===== */}
      <Section>
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            <p className="mt-4 text-slate-600 max-w-prose">{subtitle}</p>
            <div className="mt-6 flex gap-3">
              {btn1Text && (
                <Link to={btn1Url}>
                  <Button size="lg">{btn1Text}</Button>
                </Link>
              )}
              {btn2Text && (
                <Link to={btn2Url}>
                  <Button variant="outline" size="lg">
                    {btn2Text}
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="aspect-video rounded-3xl bg-white/60 backdrop-blur shadow-card border overflow-hidden">
            {embedSrc ? (
              <iframe
                src={embedSrc}
                title="Hero Video"
                allow="autoplay; encrypted-media; picture-in-picture"
                loading="lazy"
                className="h-full w-full"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-slate-400 text-sm">
                Video belum diset (atur di Admin → Hero)
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ===== BLOK DI BAWAH HERO: KIRI = WELCOME, KANAN = SIDEBAR ===== */}
      {s?.home_show_welcome && (
        <Section title={undefined} subtitle={undefined}>
          <div className="grid md:grid-cols-12 gap-8">
            {/* KIRI: Sambutan dengan square text wrapping */}
            <div className="md:col-span-8">
              <WelcomeComp s={s} />
            </div>

            {/* KANAN: sidebar dengan Login + Artikel */}
            <aside className="md:col-span-4 space-y-6 md:sticky md:top-24">
              <TeacherLoginCard />
              <ArticleListWidget />
            </aside>
          </div>
        </Section>
      )}

      {/* ===== MENGAPA MEMILIH KAMI ===== */}
      <Section title="Mengapa memilih kami?" subtitle="Tiga alasan utama">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Award,
              title: "Prestasi Akademik",
              desc: "Pembelajaran adaptif dan program olimpiade yang terstruktur.",
            },
            {
              icon: Users,
              title: "Karakter & Kolaborasi",
              desc: "Kegiatan ekstrakurikuler yang kaya dan komunitas suportif.",
            },
            {
              icon: BookOpen,
              title: "Kurikulum Modern",
              desc: "STEAM, literasi digital, dan pembelajaran berbasis proyek.",
            },
          ].map((f, i) => (
            <div key={i} className="card p-6 hover:shadow-card transition">
              <f.icon className="h-5 w-5 text-brand-600" />
              <h3 className="mt-3 font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-slate-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ===== GALERI BERANDA (published) ===== */}
      {s?.home_show_gallery && (
        <Section title="Galeri Kegiatan" subtitle="Momen-momen siswa terbaru.">
          {galeri.length === 0 ? (
            <div className="text-slate-500">Belum ada foto yang dipublish.</div>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {galeri.map((g) => (
                <li
                  key={g.id}
                  className="rounded-2xl overflow-hidden border bg-white hover:shadow-card transition"
                >
                  <figure className="aspect-[4/3] bg-slate-100">
                    <img
                      src={g.image_url}
                      alt={g.title ?? ""}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </figure>
                  {g.title || g.caption ? (
                    <div className="p-3 text-sm">
                      <div className="font-medium truncate">{g.title}</div>
                      <div className="text-slate-600 line-clamp-2">
                        {g.caption}
                      </div>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <Link
              to="/galeri"
              className="text-primary-600 hover:underline text-sm"
            >
              Lihat semua galeri →
            </Link>
          </div>
        </Section>
      )}
    </div>
  );
}
