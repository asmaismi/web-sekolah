import Section from "@/components/common/Section";
import { FlaskConical, BarChart3, Languages } from "lucide-react";
import type { ComponentType } from "react";

type ProgramItem = {
  name: string;
  desc: string;
  Icon: ComponentType<{ size?: number }>;
  accent: 0 | 1 | 2 | 3;
};

/** Palet aksen untuk kartu (berputar) */
const ACCENTS = [
  {
    ring: "from-sky-400 to-cyan-500",
    badge: "from-sky-500 to-cyan-500",
    title: "text-sky-700",
  },
  {
    ring: "from-violet-500 to-fuchsia-500",
    badge: "from-violet-500 to-fuchsia-500",
    title: "text-violet-700",
  },
  {
    ring: "from-emerald-500 to-teal-500",
    badge: "from-emerald-500 to-teal-500",
    title: "text-emerald-700",
  },
  {
    ring: "from-amber-500 to-orange-500",
    badge: "from-amber-500 to-orange-500",
    title: "text-amber-700",
  },
] as const;

const programs: ProgramItem[] = [
  {
    name: "IPA",
    desc: "Pendalaman sains, laboratorium lengkap.",
    Icon: FlaskConical,
    accent: 0,
  },
  {
    name: "IPS",
    desc: "Ekonomi, sosiologi, dan geografi terapan.",
    Icon: BarChart3,
    accent: 1,
  },
  {
    name: "Bahasa",
    desc: "Bahasa Indonesia, Inggris, dan Jepang.",
    Icon: Languages,
    accent: 2,
  },
];

function ProgramCard({ item, i }: { item: ProgramItem; i: number }) {
  const palette = ACCENTS[item.accent ?? i % ACCENTS.length];
  const { Icon } = item;

  return (
    <div
      className={`rounded-2xl p-[1.5px] bg-gradient-to-br ${palette.ring} hover:shadow-lg transition`}
    >
      <div className="rounded-2xl bg-white p-5 h-full">
        <div className="flex items-start gap-3">
          {/* Badge ikon */}
          <span
            className={`grid h-10 w-10 place-items-center rounded-xl text-white shadow bg-gradient-to-br ${palette.badge}`}
          >
            <Icon size={18} />
          </span>

          {/* Judul + deskripsi */}
          <div className="min-w-0">
            <h3 className={`font-semibold ${palette.title}`}>{item.name}</h3>
            <p className="mt-1 text-sm leading-relaxed text-slate-700">
              {item.desc}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Program() {
  return (
    <Section
      title="Program & Kurikulum"
      subtitle="Jalur peminatan dan muatan lokal."
    >
      <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {programs.map((p, i) => (
          <li key={p.name}>
            <ProgramCard item={p} i={i} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
