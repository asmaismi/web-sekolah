// src/pages/admin/homeparts/WhyUsControl.tsx
import Button from "@/components/ui/Button";
import { updateSettings } from "@/services/settings";
import { useSettings, type SiteSettings } from "@/store/settings";
import useUI from "@/store/ui";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

type Props = {
  f: Partial<SiteSettings>;
  setF: Dispatch<SetStateAction<Partial<SiteSettings>>>;
};

export default function WhyUsControl({ f, setF }: Props) {
  const notify = useUI((s) => s.add);
  const [saving, setSaving] = useState<"on" | "off" | null>(null);

  async function setWhyUs(val: boolean) {
    setSaving(val ? "on" : "off");
    try {
      await updateSettings({ home_show_whyus: val });
      // local
      setF((v) => ({ ...v, home_show_whyus: val }));
      // global
      const prev = useSettings.getState().data || ({ id: 1 } as SiteSettings);
      useSettings.setState({ data: { ...prev, home_show_whyus: val } as SiteSettings } as any);

      notify(val ? "Why Us diaktifkan" : "Why Us disembunyikan");
    } catch (e: any) {
      notify(e?.message || "Gagal menyimpan");
    } finally {
      setSaving(null);
    }
  }

  const active = !!f.home_show_whyus;

  return (
    <div className="rounded-2xl border bg-white p-4 md:p-5 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="text-sm font-semibold">Section “Mengapa memilih kami”</div>
          <p className="text-xs text-slate-600">
            Tiga kartu alasan utama—ikon, judul, dan deskripsi singkat. Bisa kamu tampilkan/sembunyikan dari beranda.
          </p>
          <div className="mt-2 inline-flex items-center gap-2 text-[11px]">
            <span className="text-slate-500">Status:</span>
            <span
              className={`rounded-full px-2 py-0.5 ${
                active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {active ? "ON" : "OFF"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setWhyUs(true)} disabled={saving === "on" || active}>
            ON
          </Button>
          <Button variant="subtle" onClick={() => setWhyUs(false)} disabled={saving === "off" || !active}>
            OFF
          </Button>
        </div>
      </div>
    </div>
  );
}
