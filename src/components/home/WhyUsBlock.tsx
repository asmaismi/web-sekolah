import Section from "@/components/common/Section";
import { Award, Users, BookOpen } from "lucide-react";

type WhyItem = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  desc: string;
};

type Props = {
  items?: WhyItem[]; // optional, biar gampang dikustom nanti
};

const DEFAULT_ITEMS: WhyItem[] = [
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
];

export default function WhyUsBlock({ items = DEFAULT_ITEMS }: Props) {
  return (
    <Section title="Mengapa memilih kami?" subtitle="Tiga alasan utama">
      <div className="grid md:grid-cols-3 gap-6">
        {items.map((f, i) => (
          <div key={i} className="card p-6 hover:shadow-card transition">
            <f.icon className="h-5 w-5 text-brand-600" />
            <h3 className="mt-3 font-semibold text-slate-900">{f.title}</h3>
            <p className="mt-2 text-slate-600 text-sm">{f.desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
