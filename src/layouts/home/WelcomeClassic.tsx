// src/layouts/home/WelcomeClassic.tsx
import type { WelcomeLayoutProps } from "./types";

export default function WelcomeClassic({ s }: WelcomeLayoutProps) {
  if (!s?.home_show_welcome) return null;

  return (
    <div className="rounded-2xl border bg-white shadow-card p-6">
      <div
        className="
          prose prose-slate max-w-none
          prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:font-extrabold prose-h2:leading-tight prose-h2:mt-0 prose-h2:mb-2
          prose-p:text-[17px] prose-p:leading-7 prose-p:my-3 md:prose-p:my-4 prose-p:text-slate-700 prose-p:text-justify
        "
      >
        {s?.home_welcome_image_url && (
          <img
            src={s.home_welcome_image_url}
            alt={s?.home_principal_name || "Kepala Sekolah"}
            className="shape-rounded border shadow-sm"
            loading="lazy"
          />
        )}

        <h2 className="mt-0">{s?.home_welcome_title || "Selamat Datang"}</h2>

        <p className="whitespace-pre-line">
          {s?.home_welcome_body ||
            "Belum ada isi sambutan. Silakan set dari Admin → Homepage."}
        </p>

        {s?.home_principal_name && (
          <p className="mt-4 font-semibold text-slate-700 text-[17px]">
            — {s.home_principal_name}, Kepala Sekolah
          </p>
        )}
      </div>
    </div>
  );
}
