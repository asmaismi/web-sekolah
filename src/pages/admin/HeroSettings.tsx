import AdminOnly from "@/components/admin/AdminOnly";
import Section from "@/components/common/Section";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Textarea from "@/components/ui/Textarea";
import {
  getSettings,
  updateSettings,
  type SiteSettings,
} from "@/services/settings";
import useUI from "@/store/ui";
import { useEffect, useState, type FormEvent } from "react";

function getEmbedSrc(
  url: string,
  opts: { autoplay?: boolean; muted?: boolean; loop?: boolean } = {},
) {
  if (!url) return "";
  const a = !!opts.autoplay,
    m = opts.muted !== false,
    l = !!opts.loop;
  const u = url.trim();

  // YouTube
  const yt = u.match(
    /(?:youtu\.be\/([A-Za-z0-9_-]{6,})|youtube\.com\/(?:watch\?v=|embed\/)([A-Za-z0-9_-]{6,}))/i,
  );
  if (yt) {
    const id = yt[1] || yt[2];
    const base = `https://www.youtube.com/embed/${id}`;
    const q = new URLSearchParams();
    q.set("rel", "0");
    q.set("modestbranding", "1");
    q.set("autoplay", "1");
    q.set("mute", "1");
    q.set("loop", "1");
    if (id) q.set("playlist", id);
    return `${base}?${q.toString()}`;
  }

  // Vimeo
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm) {
    const id = vm[1];
    const base = `https://player.vimeo.com/video/${id}`;
    const q = new URLSearchParams();
    q.set("rel", "0");
    q.set("modestbranding", "1");
    q.set("autoplay", a ? "1" : "0");
    q.set("mute", m ? "1" : "0");
    q.set("loop", l ? "1" : "0");
    if (id) q.set("playlist", id);
    return `${base}?${q.toString()}`;
  }

  // Generic iframe (anggap valid)
  return u;
}

export default function HeroSettings() {
  const addToast = useUI((s) => s.add);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState<Partial<SiteSettings>>({});

  useEffect(() => {
    (async () => {
      try {
        const s = await getSettings();
        setF(s);
      } catch (e: any) {
        addToast(e?.message || "Gagal memuat data");
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSettings({
        hero_title: f.hero_title ?? null,
        hero_subtitle: f.hero_subtitle ?? null,
        hero_btn_text: f.hero_btn_text ?? null,
        hero_btn_url: f.hero_btn_url ?? null,
        hero_btn2_text: f.hero_btn2_text ?? null,
        hero_btn2_url: f.hero_btn2_url ?? null,
        hero_media_url: f.hero_media_url ?? null,
        hero_media_autoplay: !!f.hero_media_autoplay,
        hero_media_muted: f.hero_media_muted !== false,
        hero_media_loop: !!f.hero_media_loop,
      });
      addToast("Hero disimpan");
    } catch (e: any) {
      addToast(e?.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  const embedSrc = getEmbedSrc(f.hero_media_url || "", {
    autoplay: !!f.hero_media_autoplay,
    muted: f.hero_media_muted !== false,
    loop: !!f.hero_media_loop,
  });

  return (
    <AdminOnly>
      <Section
        title="Hero Beranda"
        subtitle="Atur judul, subjudul, tombol, dan video di beranda."
      >
        <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-6">
          {/* Kolom kiri */}
          <div className="space-y-4 bg-white border rounded-xl p-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!f.home_show_hero}
                onChange={(e) => setF((v) => ({ ...v, home_show_hero: e.target.checked }))}
              />
              Tampilkan Hero di Beranda
            </label>
            <div>
              <Label>Judul</Label>
              <Input
                value={f.hero_title || ""}
                onChange={(e) =>
                  setF((v) => ({ ...v, hero_title: e.target.value }))
                }
              />
            </div>
            <div>
              <Label>Subjudul</Label>
              <Textarea
                rows={4}
                value={f.hero_subtitle || ""}
                onChange={(e) =>
                  setF((v) => ({ ...v, hero_subtitle: e.target.value }))
                }
              />
            </div>

            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>Tombol 1 — Teks</Label>
                <Input
                  value={f.hero_btn_text || ""}
                  onChange={(e) =>
                    setF((v) => ({ ...v, hero_btn_text: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Tombol 1 — URL</Label>
                <Input
                  value={f.hero_btn_url || ""}
                  onChange={(e) =>
                    setF((v) => ({ ...v, hero_btn_url: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Tombol 2 — Teks</Label>
                <Input
                  value={f.hero_btn2_text || ""}
                  onChange={(e) =>
                    setF((v) => ({ ...v, hero_btn2_text: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Tombol 2 — URL</Label>
                <Input
                  value={f.hero_btn2_url || ""}
                  onChange={(e) =>
                    setF((v) => ({ ...v, hero_btn2_url: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Kolom kanan */}
          <div className="space-y-4 bg-white border rounded-xl p-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!f.home_show_hero}
                onChange={(e) => setF((v) => ({ ...v, home_show_hero: e.target.checked }))}
              />
              Tampilkan Hero di Beranda
            </label>
            <div>
              <Label>URL Video (YouTube/Vimeo/iframe)</Label>
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={f.hero_media_url || ""}
                onChange={(e) =>
                  setF((v) => ({ ...v, hero_media_url: e.target.value }))
                }
              />
              <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!f.hero_media_autoplay}
                    onChange={(e) =>
                      setF((v) => ({
                        ...v,
                        hero_media_autoplay: e.target.checked,
                      }))
                    }
                  />
                  Autoplay
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={f.hero_media_muted !== false}
                    onChange={(e) =>
                      setF((v) => ({
                        ...v,
                        hero_media_muted: e.target.checked,
                      }))
                    }
                  />
                  Muted
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!f.hero_media_loop}
                    onChange={(e) =>
                      setF((v) => ({ ...v, hero_media_loop: e.target.checked }))
                    }
                  />
                  Loop
                </label>
              </div>
            </div>

            {/* Preview */}
            <div>
              <Label>Preview</Label>
              <div className="mt-2 rounded-2xl border overflow-hidden bg-slate-50 aspect-video">
                {embedSrc ? (
                  <iframe
                    src={embedSrc}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    className="h-full w-full"
                    loading="lazy"
                    title="Hero Preview"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-slate-400 text-sm">
                    Masukkan URL video untuk melihat preview
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan…" : "Simpan"}
              </Button>
            </div>
          </div>
        </form>
      </Section>
    </AdminOnly>
  );
}
