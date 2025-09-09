// src/pages/admin/HomeQuickControls.tsx
import type { HomeTemplateKey } from "@/components/home/global/registry";
import TeacherLoginCardControl from "@/pages/admin/homeparts/TeacherLoginCardControl";
import { useHomeSettingsForm } from "./homeparts/useHomeSettingsForm";

const TEMPLATES: { key: HomeTemplateKey; label: string }[] = [
  { key: "universitas", label: "Universitas" },
  { key: "highschool", label: "High School" },
  { key: "smp", label: "SMP (WIP)" },
  { key: "sd", label: "SD (WIP)" },
];

export default function HomeQuickControls() {
  const { f, setF, save, saving } = useHomeSettingsForm();

  const toggles: { key: keyof typeof f; label: string }[] = [
    { key: "home_show_welcome", label: "Sambutan KepSek" },
    { key: "home_show_news", label: "Berita" },
    { key: "home_show_events", label: "Agenda" },
    { key: "home_show_announcements", label: "Pengumuman" },
    { key: "home_show_gallery", label: "Galeri" },
    { key: "home_show_whyus", label: "Why Us" },
  ];

  return (
    <section className="rounded-2xl border bg-white p-4 md:p-6 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Homepage – Quick Controls</h2>
          <p className="text-sm text-slate-600">
            ON/OFF modul & pilih template. Detail lengkap tetap di menu “Homepage”.
          </p>
        </div>
        <button
          onClick={() => save()}
          className="rounded-xl bg-violet-600 px-4 py-2 text-white disabled:opacity-60"
          disabled={saving}
        >
          {saving ? "Menyimpan…" : "Simpan"}
        </button>
      </header>

      {/* Template */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Template</label>
        <div className="flex flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.key}
              onClick={() => setF((prev) => ({ ...prev, home_template: t.key }))}
              className={`rounded-xl px-3 py-1.5 text-sm border transition
                ${f.home_template === t.key ? "bg-violet-50 border-violet-300 text-violet-700" : "bg-white hover:bg-slate-50"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="grid gap-3 md:grid-cols-2">
        {toggles.map((t) => (
          <label key={String(t.key)} className="flex items-center justify-between rounded-xl border px-3 py-2">
            <span className="text-sm">{t.label}</span>
            <input
              type="checkbox"
              checked={Boolean(f[t.key])}
              onChange={(e) => setF((prev) => ({ ...prev, [t.key]: e.target.checked }))}
              className="h-4 w-4 accent-violet-600"
            />
          </label>
        ))}
      </div>
      {/* Kartu khusus: Login Guru */}
      <div className="mt-4">
        <TeacherLoginCardControl f={f} setF={setF} />
      </div>
    </section>
  );
}
