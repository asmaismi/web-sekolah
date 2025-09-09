// src/pages/admin/homeparts/TeacherLoginCardControl.tsx
import Button from "@/components/ui/Button";
import { updateSettings } from "@/services/settings";
import { useSettings, type SiteSettings } from "@/store/settings";
import useUI from "@/store/ui";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

type Props = {
  f: Partial<SiteSettings>;
  setF: Dispatch<SetStateAction<any>>;
};

export default function TeacherLoginCardControl({ f, setF }: Props) {
  const [saving, setSaving] = useState<"on" | "off" | null>(null);
  const notify = useUI((s) => s.add);

  async function setTeacherLogin(val: boolean) {
    setSaving(val ? "on" : "off");
    try {
      await updateSettings({ home_show_teacher_login: val });

      // local
      setF((v: any) => ({ ...v, home_show_teacher_login: val }));

      // global
      const prev = useSettings.getState().data || ({ id: 1 } as SiteSettings);
      useSettings.setState({ data: { ...prev, home_show_teacher_login: val } as SiteSettings } as any);

      notify(val ? "Login Guru diaktifkan" : "Login Guru disembunyikan");
    } catch (e: any) {
      notify(e?.message || "Gagal menyimpan");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4 md:p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-medium">Login Guru</div>
          <div className="text-xs text-slate-500">
            Form pendaftaran/login guru akan tampil di beranda (sidebar) sesuai template.
          </div>
          <div className="mt-2 inline-flex items-center gap-2 text-xs">
            <span>Status:</span>
            <span
              className={`rounded-full px-2 py-0.5 ${
                f.home_show_teacher_login ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
              }`}
            >
              {f.home_show_teacher_login ? "ON" : "OFF"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => setTeacherLogin(true)} disabled={saving === "on" || !!f.home_show_teacher_login}>
            Aktifkan
          </Button>
          <Button
            variant="subtle"
            onClick={() => setTeacherLogin(false)}
            disabled={saving === "off" || !f.home_show_teacher_login}
          >
            Sembunyikan
          </Button>
        </div>
      </div>
    </div>
  );
}
