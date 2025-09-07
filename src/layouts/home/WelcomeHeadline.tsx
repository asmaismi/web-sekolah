import type { WelcomeLayoutProps } from "./types";

export default function WelcomeHeadline({ s }: WelcomeLayoutProps) {
  if (!s?.home_show_welcome) return null;

  return (
    <div className="rounded-2xl border bg-white shadow-card p-6">
      <div className="text-center">
        {s?.home_welcome_image_url && (
          <img
            src={s.home_welcome_image_url}
            alt={s?.home_principal_name || "Kepala Sekolah"}
            className="mx-auto mb-4 h-40 w-40 rounded-2xl object-cover border shadow-sm"
            loading="lazy"
          />
        )}

        <h2 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3">
          {s?.home_welcome_title || "Selamat Datang"}
        </h2>
      </div>

      <div className="prose prose-slate max-w-none prose-p:text-[17px] prose-p:leading-7 prose-p:text-justify">
        <p className="whitespace-pre-line">{s?.home_welcome_body}</p>

        {s?.home_principal_name && (
          <p className="mt-4 font-semibold text-slate-700 text-center text-[17px]">
            — {s.home_principal_name}, Kepala Sekolah
          </p>
        )}
      </div>
    </div>
  );
}
