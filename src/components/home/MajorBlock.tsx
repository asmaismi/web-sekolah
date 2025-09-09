import Section from "@/components/common/Section";

export type MajorItem = {
  id: string;
  name: string;
  image_url?: string | null;
  desc?: string | null;
  slug?: string | null;
};

export default function MajorBlock({ items = [] as MajorItem[] }) {
  if (!items.length) return null;

  return (
    <Section title="Jurusan" subtitle="Pilihan kompetensi keahlian di SMK">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <li
            key={m.id}
            className="rounded-2xl border bg-white p-4 shadow-card"
          >
            <div className="aspect-[4/2] overflow-hidden rounded-xl bg-slate-100">
              {m.image_url ? (
                <img
                  src={m.image_url}
                  alt={m.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>
            <h3 className="mt-3 font-semibold text-slate-900">{m.name}</h3>
            {m.desc ? (
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">
                {m.desc}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </Section>
  );
}
