import WhyUsBlock from "@/components/home/WhyUsBlock";

type Props = {
  s: any;
  galeri: Array<{ id: string | number; url: string; title?: string | null }>;
  F: any;
};

export default function Sd({ s, galeri, F }: Props) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <section className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold">Template SD</h1>
        <p className="text-sm text-slate-600">Versi awal—aman dipakai, tinggal dimakeup nanti.</p>
      </section>

      {F?.welcome?.enabled && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-sm font-semibold">{s?.home_welcome_title || "Sambutan"}</h2>
          <p className="text-sm text-slate-700 whitespace-pre-line">{s?.home_welcome_body || "…"}</p>
        </section>
      )}

      {F?.whyus?.enabled && <WhyUsBlock />}

      {F?.gallery?.enabled && (
        <section className="rounded-2xl border bg-white p-6 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {galeri.map((g) => (
              <img
                key={g.id}
                src={g.url}
                alt={g.title || ""}
                className="h-28 w-full rounded-xl object-cover"
                loading="lazy"
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
