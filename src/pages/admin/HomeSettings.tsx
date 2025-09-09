// src/pages/admin/HomeSettings.tsx — refactor ringkas
import AdminOnly from "@/components/admin/AdminOnly";
import Button from "@/components/ui/Button";
import useUI from "@/store/ui";
import { useEffect, useState } from "react";

import { getSettings, updateSettings, type HomeTemplateKey } from "@/services/settings";
import { useSettings, type SiteSettings } from "@/store/settings";

// Bagian-bagian halaman dipisah sebagai komponen kecil
import GalleryCard from "@/pages/admin/homeparts/GalleryCard";
import LayoutPicker from "@/pages/admin/homeparts/LayoutPicker";
import TeacherLoginCardControl from "@/pages/admin/homeparts/TeacherLoginCardControl";
import TemplatePicker from "@/pages/admin/homeparts/TemplatePicker";
import WelcomeCard from "@/pages/admin/homeparts/WelcomeCard";
import WhyUsControl from "@/pages/admin/homeparts/WhyUsControl";

/** Helper: patch state global secara aman */
function patchSettings(fields: Partial<SiteSettings>) {
  const prev = useSettings.getState().data || ({ id: 1 } as SiteSettings);
  useSettings.setState({ data: { ...prev, ...fields } as SiteSettings } as any);
}

export default function HomeSettings() {
  const notify = useUI((s) => s.add);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // State form lokal — hanya sebagian field yang dipakai halaman ini
  const [f, setF] = useState<Partial<SiteSettings>>({});

  // Load awal
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = (await getSettings()) as Partial<SiteSettings>;
        setF(data);
        patchSettings(data);
      } catch (e: any) {
        notify(e?.message || "Gagal memuat");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function saveAll() {
    setSaving(true);
    try {
      await updateSettings(f);
      patchSettings(f);
      notify("Homepage disimpan");
    } catch (e: any) {
      notify(e?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  }

  // Aksi cepat tingkat halaman (jika butuh)
  async function activateTemplate(key: HomeTemplateKey) {
    try {
      await updateSettings({ home_template: key });
      setF((v) => ({ ...v, home_template: key }));
      patchSettings({ home_template: key });
      notify("Template beranda diaktifkan");
    } catch (e: any) {
      notify(e?.message || "Gagal mengaktifkan template");
    }
  }

  async function toggleTeacherLogin(val: boolean) {
    try {
      await updateSettings({ home_show_teacher_login: val });
      setF((v) => ({ ...v, home_show_teacher_login: val }));
      patchSettings({ home_show_teacher_login: val });
      notify(val ? "Form Login Guru diaktifkan" : "Form Login Guru disembunyikan");
    } catch (e: any) {
      notify(e?.message || "Gagal menyimpan");
    }
  }

  return (
    <AdminOnly>
      <div className="mx-auto max-w-5xl p-4 md:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold">Pengaturan Beranda</h1>
            <p className="text-sm text-slate-600">Pilih template, layout, dan isi beranda sekolah.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={saveAll} disabled={loading || saving}>
              {saving ? "Menyimpan…" : "Simpan Semua"}
            </Button>
          </div>
        </div>

        {/* Template */}
        <TemplatePicker f={f} setF={setF} />

        {/* Layout */}
        <LayoutPicker f={f} setF={setF} />

        {/* Sambutan & Foto Kepala Sekolah (URL + teks) */}
        <WelcomeCard f={f} setF={setF} />
        
        {/* Why Us */}
        <WhyUsControl f={f} setF={setF} />

        {/* Galeri */}
        <GalleryCard f={f} setF={setF} />

        {/* Login Guru */}
        <TeacherLoginCardControl f={f} setF={setF} />

        {/* Aksi cepat (opsional) */}
        <div className="hidden">{/* contoh pemakaian */}
          <button onClick={() => activateTemplate((f.home_template as HomeTemplateKey) || "universitas")}>Aktifkan Template</button>
          <button onClick={() => toggleTeacherLogin(!f.home_show_teacher_login)}>Toggle Login Guru</button>
        </div>
      </div>
    </AdminOnly>
  );
}
