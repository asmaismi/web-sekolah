// src/pages/admin/homeparts/WelcomeCard.tsx
import { updateSettings } from "@/services/settings";
import { useSettings, type SiteSettings } from "@/store/settings";
import useUI from "@/store/ui";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

type Props = {
  f: Partial<SiteSettings>;
  setF: Dispatch<SetStateAction<Partial<SiteSettings>>>;
};

export default function WelcomeCard({ f, setF }: Props) {
  const notify = useUI((s) => s.add);
  const [saving, setSaving] = useState(false);

  async function save(fields: Partial<SiteSettings>) {
    setSaving(true);
    try {
      await updateSettings(fields);

      // local
      setF((v) => ({ ...v, ...fields }));

      // global (object style)
      const prev = useSettings.getState().data || ({} as Partial<SiteSettings>);
      useSettings.setState({ data: { ...(prev as object), ...fields } as SiteSettings } as any);

      notify("Sambutan disimpan.");
    } catch (e: any) {
      notify(e?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4 md:p-5">
      <div className="mb-2 text-lg font-semibold">Sambutan Kepala Sekolah</div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs text-slate-600">Judul</span>
          <input
            className="rounded-xl border px-3 py-2"
            value={f.home_welcome_title || ""}
            onChange={(e) => setF((v) => ({ ...v, home_welcome_title: e.target.value }))}
            onBlur={(e) => save({ home_welcome_title: e.target.value })}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-slate-600">Nama Kepala Sekolah</span>
          <input
            className="rounded-xl border px-3 py-2"
            value={f.home_principal_name || ""}
            onChange={(e) => setF((v) => ({ ...v, home_principal_name: e.target.value }))}
            onBlur={(e) => save({ home_principal_name: e.target.value })}
          />
        </label>

        <label className="md:col-span-2 grid gap-1">
          <span className="text-xs text-slate-600">Isi Sambutan</span>
          <textarea
            className="min-h-[120px] rounded-xl border px-3 py-2"
            value={f.home_welcome_body || ""}
            onChange={(e) => setF((v) => ({ ...v, home_welcome_body: e.target.value }))}
            onBlur={(e) => save({ home_welcome_body: e.target.value })}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs text-slate-600">URL Foto</span>
          <input
            className="rounded-xl border px-3 py-2"
            value={f.home_welcome_image_url || ""}
            onChange={(e) => setF((v) => ({ ...v, home_welcome_image_url: e.target.value }))}
            onBlur={(e) => save({ home_welcome_image_url: e.target.value })}
          />
        </label>
      </div>

      <div className="mt-3">
        <button
          className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-60"
          onClick={() => save({})}
          disabled={saving}
        >
          {saving ? "Menyimpan…" : "Simpan perubahan"}
        </button>
      </div>
    </div>
  );
}
