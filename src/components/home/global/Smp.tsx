import WhyUsBlock from "@/components/home/WhyUsBlock";

type Props = {
  s: any; // kalau mau strict nanti ganti ke SiteSettings
  galeri: Array<{ id: string | number; url: string; title?: string | null }>;
  F: any; // feature map dari buildFeatures
};

export default function Smp({ s, galeri, F }: Props) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      {/* Hero / Header */}
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold">Template SMP</h1>
        <p className="text-sm text-slate-600">Placeholder rapi. Layout final bisa diisi belakangan.</p>
      </section>

      {/* Sambutan (opsional) */}
      {F?.welcome?.enabled && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold">{s?.home_welcome_title || "Sambutan"}</h2>
          <p className="text-sm text-slate-700 whitespace-pre-line">{s?.home_welcome_body || "…"}</p>
        </section>
      )}

      {/* Why Us (opsional) */}
      {F?.whyus?.enabled && <WhyUsBlock />}

      {/* Galeri (opsional) */}
      {F?.gallery?.enabled && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
            {galeri.map((g) => (
              <img
                key={g.id}
                src={g.url}
                alt={g.title || ""}
                className="h-32 w-full rounded-xl object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
