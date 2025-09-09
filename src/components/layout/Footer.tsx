import Container from "@/components/common/Container";
import { useSettings } from "@/store/settings";
import { useEffect, useMemo } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";

export default function Footer() {
  // Settings (nama, tagline, kontak, sosmed, warna utama)
  const { data: s, status, init } = useSettings();
  useEffect(() => {
    if (status === "idle") void init();
  }, [status, init]);

  const year = new Date().getFullYear();
  const siteName = s?.site_name ?? "Nama Sekolah";
  const tagline = s?.tagline ?? "Tagline sekolah";
  const email = s?.contact_email || "";
  const phone = s?.phone || "";
  const address = s?.address || "";
  const facebook = s?.facebook || "";
  const instagram = s?.instagram || "";
  const youtube = s?.youtube || "";
  const primary = useMemo(
    () => s?.primary_color ?? "#6d28d9",
    [s?.primary_color],
  );

  // --- kecil2 manis reusable ---
  const Badge = ({ children }: { children: React.ReactNode }) => (
    <span
      className="inline-grid h-7 w-7 place-items-center rounded-full text-white shadow-sm"
      style={{ background: primary }}
    >
      {children}
    </span>
  );

  function Row({
    icon,
    text,
    href,
  }: {
    icon: React.ReactNode;
    text: string;
    href?: string;
  }) {
    if (!text) return null;
    const content = (
      <div className="flex items-center gap-3">
        <Badge>{icon}</Badge>
        <span className="text-sm text-slate-700">{text}</span>
      </div>
    );
    return href ? (
      <a
        className="hover:underline"
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel="noopener noreferrer"
      >
        {content}
      </a>
    ) : (
      content
    );
  }

  function Social({
    href,
    label,
    children,
  }: {
    href?: string;
    label: string;
    children: React.ReactNode;
  }) {
    if (!href) return null;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="inline-grid h-8 w-8 place-items-center rounded-full text-white
                   bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow hover:opacity-90"
      >
        {children}
      </a>
    );
  }

  function SectionHeader({
    eyebrow,
    title,
  }: {
    eyebrow: string;
    title: string;
  }) {
    return (
      <div>
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
          style={{ color: primary, background: `${primary}15` }} // 15 ≈ ~8% alpha
        >
          {eyebrow}
        </span>
        <h2 className="mt-2 text-xl font-bold" style={{ color: primary }}>
          {title}
        </h2>
        <div
          className="mt-2 h-1 w-16 rounded-full"
          style={{
            background: `linear-gradient(90deg, ${primary}, ${primary}66)`,
          }} // 66 ≈ ~40% alpha
        />
      </div>
    );
  }

  return (
    <footer className="mt-16 relative bg-gradient-to-b from-slate-50 to-slate-100">
      {/* top subtle divider */}
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

      <Container>
        {/* Grid utama */}
        <div className="py-12 grid gap-12 md:grid-cols-12">
          {/* Brand + Sosial */}
          <div className="md:col-span-4">
            <SectionHeader eyebrow="Sekolah" title={siteName} />
            <p className="mt-3 text-sm text-slate-600">{tagline}</p>
            <div className="mt-5 flex items-center gap-2">
              <Social href={facebook} label="Facebook">
                <Facebook size={16} />
              </Social>
              <Social href={instagram} label="Instagram">
                <Instagram size={16} />
              </Social>
              <Social href={youtube} label="YouTube">
                <Youtube size={16} />
              </Social>
            </div>
          </div>

          {/* Kontak */}
          <div className="md:col-span-5">
            <SectionHeader eyebrow="Informasi" title="Kontak" />
            <div className="mt-5 grid gap-3">
              <Row
                icon={<Mail size={14} />}
                text={email}
                {...(email ? { href: `mailto:` + email } : {})}
              />
              <Row
                icon={<Phone size={14} />}
                text={phone}
                {...(phone ? { href: `tel:` + phone.replace(/\s+/g, "") } : {})}
              />
              <Row icon={<MapPin size={14} />} text={address} />
            </div>
          </div>

          {/* Navigasi */}
          <div className="md:col-span-3">
            <SectionHeader eyebrow="Menu" title="Navigasi" />
            <ul className="mt-5 grid gap-2 text-sm">
              <li>
                <a href="/berita" className="text-slate-700 hover:underline">
                  Berita
                </a>
              </li>
              <li>
                <a href="/galeri" className="text-slate-700 hover:underline">
                  Galeri
                </a>
              </li>
              <li>
                <a href="/agenda" className="text-slate-700 hover:underline">
                  Agenda
                </a>
              </li>
              <li>
                <a href="/ppdb" className="text-slate-700 hover:underline">
                  PPDB
                </a>
              </li>
              <li>
                <a href="/kontak" className="text-slate-700 hover:underline">
                  Kontak
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* garis pemisah */}
        <div className="border-t border-slate-200" />

        {/* bar bawah */}
        <div className="py-4 flex flex-col gap-3 items-start justify-between text-xs text-slate-500 md:flex-row md:items-center">
          <div>
            © {year} {siteName}. All rights reserved.
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="hidden md:inline">Tema</span>
            <span
              className="h-3 w-3 rounded-full border border-white/60 shadow-sm"
              style={{ background: primary }}
            />
          </div>
        </div>
      </Container>
    </footer>
  );
}
