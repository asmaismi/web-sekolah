import { Link } from "react-router-dom";
import Section from "@/components/common/Section";
import Button from "@/components/ui/Button";
import type { SiteSettings } from "@/services/settings";

type HeroFields = {
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_btn_text?: string | null;
  hero_btn_url?: string | null;
  hero_btn2_text?: string | null;
  hero_btn2_url?: string | null;
  hero_media_url?: string | null;
  hero_media_autoplay?: boolean | null;
  hero_media_muted?: boolean | null;
  hero_media_loop?: boolean | null;
};

// Helper kecil untuk url video (YouTube/Vimeo/iframe)
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
    const q = new URLSearchParams();
    q.set("rel", "0");
    q.set("modestbranding", "1");
    q.set("autoplay", "1");
    q.set("mute", "1");
    q.set("loop", "1");
    if (id) q.set("playlist", id);
    return `https://www.youtube.com/embed/${id}?${q.toString()}`;
  }

  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm) {
    const id = vm[1];
    const q = new URLSearchParams();
    q.set("rel", "0");
    q.set("modestbranding", "1");
    q.set("autoplay", "1");
    q.set("mute", "1");
    q.set("loop", "1");
    if (id) q.set("playlist", id);
    return `https://player.vimeo.com/video/${id}?${q.toString()}`;
  }
  return u;
}

export default function HeroBlock({ s }: { s?: Partial<HeroFields> }) {
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
  );
}
