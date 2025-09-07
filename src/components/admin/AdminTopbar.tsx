import { Link, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { Home, ChevronRight } from "lucide-react";

type Props = {
  /** Opsional: kalau diisi, pakai ini sebagai judul besar; kalau kosong, diambil dari path */
  title?: string;
};

function prettifySegment(seg: string) {
  if (!seg) return "";
  const isIdish = seg.length > 12 && /^[a-z0-9-]+$/i.test(seg);
  if (isIdish) return "Detail";
  const map: Record<string, string> = {
    tambah: "Tambah",
    edit: "Edit",
    detail: "Detail",
    berita: "Berita",
    kategori: "Kategori",
    pengumuman: "Pengumuman",
    galeri: "Galeri",
    acara: "Acara",
    settings: "Settings",
  };
  if (map[seg]) return map[seg];
  return seg
    .split("-")
    .map((s) => s[0]?.toUpperCase() + s.slice(1))
    .join(" ");
}

export default function AdminTopbar({ title }: Props) {
  const { pathname } = useLocation();

  // Buat crumbs dari /admin/xxx/yyy
  const crumbs = useMemo(() => {
    const trimmed = pathname.replace(/^\/admin\/?/, "");
    if (!trimmed)
      return [] as { label: string; href?: string; isId?: boolean }[];

    const rawParts = trimmed.split("/").filter(Boolean);
    const parts: { label: string; href?: string; isId?: boolean }[] = [];

    rawParts.forEach((seg, idx) => {
      const isLast = idx === rawParts.length - 1;
      const isId = seg.length > 12 && /^[a-z0-9-]+$/i.test(seg);
      const label = prettifySegment(seg);

      // href hanya untuk segmen non-ID dan non-last
      let href: string | undefined;
      if (!isLast && !isId) {
        const pathUpToHere = rawParts.slice(0, idx + 1).join("/");
        href = `/admin/${pathUpToHere}`;
      }

      parts.push({ label, href, isId });
    });
    return parts;
  }, [pathname]);

  const computedTitle =
    title || (crumbs.length ? crumbs[crumbs.length - 1].label : "Panel Admin");

  return (
    <div className="sticky top-0 z-30 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-3">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1 text-xs text-slate-500"
        >
          <Link
            to="/admin"
            className="inline-flex items-center gap-1 hover:text-slate-700"
          >
            <Home size={14} />
            Admin
          </Link>
          {crumbs.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1">
              <ChevronRight size={14} className="mx-1" />
              {c.href ? (
                <Link to={c.href} className="hover:text-slate-700">
                  {c.label}
                </Link>
              ) : (
                <span className="text-slate-700">{c.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold mt-2">{computedTitle}</h1>
      </div>
    </div>
  );
}
