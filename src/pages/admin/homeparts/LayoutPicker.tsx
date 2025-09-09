// src/pages/admin/homeparts/LayoutPicker.tsx
import { updateSettings, type HomeLayoutKey } from "@/services/settings";
import { useSettings, type SiteSettings } from "@/store/settings";
import useUI from "@/store/ui";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  f: Partial<SiteSettings>;
  setF: Dispatch<SetStateAction<Partial<SiteSettings>>>;
};

export default function LayoutPicker({ f, setF }: Props) {
  const notify = useUI((s) => s.add);

  async function choose(key: HomeLayoutKey) {
    try {
      await updateSettings({ home_layout: key });
      setF((v) => ({ ...v, home_layout: key }));

      // sinkronkan ke store global
      useSettings.setState((s) => ({
        data: { ...(s.data || {}), home_layout: key } as SiteSettings,
      }));

      notify("Layout beranda disetel.");
    } catch (e: any) {
      notify(e?.message || "Gagal menyimpan layout");
    }
  }

  const Item = ({ k, label, desc }: { k: HomeLayoutKey; label: string; desc: string }) => {
    const active = f.home_layout === k;
    return (
      <button
        onClick={() => choose(k)}
        className={`w-full rounded-xl border p-4 text-left ${
          active ? "ring-2 ring-brand-500 border-brand-200" : "hover:border-slate-300"
        }`}
      >
        <div className="font-medium">
          {label} {active && <span className="ml-1 text-xs text-emerald-600">(dipilih)</span>}
        </div>
        <div className="mt-1 text-xs text-slate-600">{desc}</div>
      </button>
    );
  };

  return (
    <div className="rounded-xl border bg-white p-4 md:p-5">
      <div className="mb-3 text-lg font-semibold">Layout Beranda</div>
      <div className="grid gap-4 md:grid-cols-2">
        <Item k="classic" label="Klasik (Foto kiri)" desc="Foto di kiri, teks di kanan." />
        <Item k="headline" label="Headline (Foto atas)" desc="Gaya tajuk, foto di atas." />
      </div>
    </div>
  );
}
