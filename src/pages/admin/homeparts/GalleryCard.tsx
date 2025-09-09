// src/pages/admin/homeparts/GalleryCard.tsx
import { updateSettings } from "@/services/settings";
import { useSettings, type SiteSettings } from "@/store/settings";
import useUI from "@/store/ui";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

type Props = {
  f: Partial<SiteSettings>;
  setF: Dispatch<SetStateAction<Partial<SiteSettings>>>;
};

export default function GalleryCard({ f, setF }: Props) {
  const notify = useUI((s) => s.add);
  const [saving, setSaving] = useState(false);

  async function save(fields: Partial<SiteSettings>) {
    setSaving(true);
    try {
      await updateSettings(fields);

      // local
      setF((v) => ({ ...v, ...fields }));

      // global
      const prev = useSettings.getState().data || ({ id: 1 } as SiteSettings);
      useSettings.setState({ data: { ...prev, ...fields } as SiteSettings } as any);

      notify("Pengaturan galeri disimpan.");
    } catch (e: any) {
      notify(e?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4 md:p-5">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Galeri Beranda</div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!f.home_show_gallery}
            onChange={(e) => save({ home_show_gallery: e.target.checked })}
          />
          Tampilkan
        </label>
      </div>

      <div className="mt-3 grid max-w-xs gap-2">
        <label className="grid gap-1">
          <span className="text-xs text-slate-600">Jumlah foto</span>
          <input
            type="number"
            min={4}
            max={24}
            className="rounded-xl border px-3 py-2"
            value={f.home_gallery_limit ?? 8}
            onChange={(e) => setF((v) => ({ ...v, home_gallery_limit: Number(e.target.value || 0) }))}
            onBlur={(e) => save({ home_gallery_limit: Number(e.target.value || 0) })}
          />
        </label>
      </div>
    </div>
  );
}
