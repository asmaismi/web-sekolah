import Container from "@/components/common/Container";
import { useSettings } from "@/store/settings";
import { useEffect, useMemo } from "react";

/** Accent palette untuk 4 kartu kecil di sisi kanan */
const ACCENTS = [
  {
    ring: "from-sky-400 to-cyan-500",
    title: "text-sky-700",
    dot: "bg-sky-500",
  },
  {
    ring: "from-violet-500 to-fuchsia-500",
    title: "text-violet-700",
    dot: "bg-violet-500",
  },
  {
    ring: "from-emerald-500 to-teal-500",
    title: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  {
    ring: "from-amber-500 to-orange-500",
    title: "text-amber-700",
    dot: "bg-amber-500",
  },
];

function ColorCard({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  const acc = { ring: '', dot: '', title: '' };
  return (
    <div
      className={`rounded-2xl p-[1.5px] bg-gradient-to-br ${acc.ring} shadow-sm`}
    >
      <div className="rounded-2xl bg-white p-4 md:p-5">
        <div className="mb-2 flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${acc.dot}`} />
          <div className={`text-sm font-semibold ${acc.title}`}>{title}</div>
        </div>
        <div className="text-slate-700 text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

export default function Profil() {
  const { data: s, status, init } = useSettings();
  useEffect(() => {
    if (status === "idle") void init();
  }, [status, init]);

  const siteName = s?.site_name ?? "Nama Sekolah";
  const tagline = s?.tagline ?? "Tagline sekolah";
  const img = s?.profile_image_url || s?.logo_url || "";
  const profile = s?.profile_text || "";
  const vision = s?.vision || "";
  const mission = s?.mission || "";
  const primary = useMemo(
    () => s?.primary_color ?? "#0ea5e9",
    [s?.primary_color],
  );

  return (
    <Container>
      {/* Header */}
      <header className="my-8">
        <h1 className="text-3xl md:text-4xl font-extrabold">Profil Sekolah</h1>
        <p className="mt-2 text-slate-600">Visi, misi, dan profil singkat.</p>
      </header>

      {/* Grid atas */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Kartu gambar kiri dengan ring sesuai warna utama */}
        <div className="md:col-span-1">
          <div
            className="rounded-2xl p-[1.5px]"
            style={{ background: primary }}
          >
            <figure className="rounded-2xl overflow-hidden bg-white">
              <div className="aspect-[4/3] bg-slate-100">
                {img ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <img src={img} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid h-full w-full place-items-center text-slate-400 text-sm">
                    Belum ada gambar
                  </div>
                )}
              </div>
              <figcaption className="p-3 text-xs text-slate-500 border-t">
                Foto/ilustrasi profil sekolah
              </figcaption>
            </figure>
          </div>
        </div>

        {/* 4 kartu premium di kanan */}
        <div className="md:col-span-2 grid gap-4 sm:grid-cols-2">
          <ColorCard index={0} title="Nama & Tagline">
            <div className="text-lg font-bold" style={{ color: primary }}>
              {siteName}
            </div>
            <div className="text-slate-600">{tagline}</div>
          </ColorCard>

          <ColorCard index={1} title="Profil Singkat">
            {profile ? (
              <p className="whitespace-pre-line">{profile}</p>
            ) : (
              <span className="text-slate-400">Belum diisi.</span>
            )}
          </ColorCard>

          <ColorCard index={2} title="Visi">
            {vision ? (
              <p className="whitespace-pre-line">{vision}</p>
            ) : (
              <span className="text-slate-400">Belum diisi.</span>
            )}
          </ColorCard>

          <ColorCard index={3} title="Misi">
            {mission ? (
              <p className="whitespace-pre-line">{mission}</p>
            ) : (
              <span className="text-slate-400">Belum diisi.</span>
            )}
          </ColorCard>
        </div>
      </div>

      {/* Spacer akhir sebelum footer */}
      <div className="mt-10" />
    </Container>
  );
}
