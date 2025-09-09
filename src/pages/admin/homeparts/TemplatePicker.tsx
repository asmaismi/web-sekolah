// src/pages/admin/homeparts/TemplatePicker.tsx
import { updateSettings, type HomeTemplateKey } from "@/services/settings";
import { useSettings, type SiteSettings } from "@/store/settings";
import useUI from "@/store/ui";
import type { Dispatch, SetStateAction } from "react";

const CHOICES: Array<{ key: HomeTemplateKey; title: string; desc: string }> = [
  { key: "universitas", title: "SMK (aktif)", desc: "Beranda terstruktur untuk sekolah kejuruan." },
  { key: "highschool", title: "SMA", desc: "Layout editorial dengan hero headline." },
  // Jika union tipe belum support, cukup dua opsi di atas dulu.
];

type Props = {
  f: Partial<SiteSettings>;
  setF: Dispatch<SetStateAction<Partial<SiteSettings>>>;
};

export default function TemplatePicker({ f, setF }: Props) {
  const notify = useUI((s) => s.add);

  async function choose(key: HomeTemplateKey) {
    try {
      await updateSettings({ home_template: key });
      setF((v) => ({ ...v, home_template: key }));

      useSettings.setState((s) => ({
        data: { ...(s.data || {}), home_template: key } as SiteSettings,
      }));

      notify("Template beranda diganti.");
    } catch (e: any) {
      notify(e?.message || "Gagal mengganti template");
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4 md:p-5">
      <div className="mb-3 text-lg font-semibold">Template Global Beranda</div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {CHOICES.map((c) => {
          const active = f.home_template === c.key;
          return (
            <button
              key={c.key}
              onClick={() => choose(c.key)}
              className={`text-left rounded-xl border p-4 transition ${
                active ? "ring-2 ring-brand-500 border-brand-200" : "hover:border-slate-300"
              }`}
            >
              <div className="font-medium">
                {c.title} {active && <span className="ml-1 text-xs text-emerald-600">(dipilih)</span>}
              </div>
              <div className="mt-1 text-xs text-slate-600">{c.desc}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
