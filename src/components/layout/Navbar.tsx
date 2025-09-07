// src/components/layout/NavBar.tsx
import { Link, NavLink } from "react-router-dom";
import {
  School,
  Menu,
  X,
  Home,
  IdCard,
  Layers,
  Newspaper,
  Images,
  CalendarDays,
  GraduationCap,
  Phone,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useSettings } from "@/store/settings";

type IconType = React.ComponentType<{ size?: number; className?: string }>;

type ItemDef = {
  to: string;
  label: string;
  end?: boolean;
  Icon: IconType;
  gradient: string;
};

const ICON_SIZE = 14; // ikon kecil
const BADGE_CLASS =
  "shrink-0 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br text-white shadow-sm";

export default function Navbar() {
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  // === Settings (site_name, logo) ===
  const { data: settings, status, init } = useSettings();
  useEffect(() => {
    if (status === "idle") void init();
  }, [status, init]);

  const siteName = settings?.site_name || "Nama Sekolah";
  const logoUrl = settings?.logo_url || "";

  const navItem =
    "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm text-slate-700 hover:bg-slate-100";
  const active = "bg-slate-100 text-slate-900 font-semibold";

  const items: ItemDef[] = [
    {
      to: "/",
      label: "Beranda",
      end: true,
      Icon: Home,
      gradient: "from-sky-500 to-cyan-500",
    },
    {
      to: "/profil",
      label: "Profil",
      Icon: IdCard,
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      to: "/program",
      label: "Program",
      Icon: Layers,
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      to: "/berita",
      label: "Berita",
      Icon: Newspaper,
      gradient: "from-violet-500 to-fuchsia-500",
    },
    {
      to: "/galeri",
      label: "Galeri",
      Icon: Images,
      gradient: "from-pink-500 to-rose-500",
    },
    {
      to: "/agenda",
      label: "Agenda",
      Icon: CalendarDays,
      gradient: "from-purple-500 to-violet-600",
    },
    {
      to: "/ppdb",
      label: "PPDB",
      Icon: GraduationCap,
      gradient: "from-amber-500 to-orange-500",
    },
    {
      to: "/kontak",
      label: "Kontak",
      Icon: Phone,
      gradient: "from-slate-500 to-zinc-600",
    },
  ];

  const Item = ({ to, label, end, Icon, gradient }: ItemDef) => (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => `${navItem} ${isActive ? active : ""}`}
      onClick={() => setOpen(false)}
    >
      <span className={`${BADGE_CLASS} ${"bg-gradient-to-br " + gradient}`}>
        <Icon size={ICON_SIZE} />
      </span>
      <span className="truncate">{label}</span>
    </NavLink>
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (open && e.key === "Tab") {
        const el = menuRef.current;
        if (!el) return;
        const focusables = el.querySelectorAll<HTMLElement>("a,button");
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    function onClick(e: MouseEvent) {
      const m = menuRef.current,
        b = btnRef.current;
      if (!m || !b) return;
      if (!m.contains(e.target as Node) && !b.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center gap-6">
        {/* Brand (ambil dari settings) */}
        <Link
          to="/"
          className="flex items-center gap-2 font-extrabold text-slate-900"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-8 w-8 rounded-lg object-contain bg-white p-1 border"
            />
          ) : (
            <span className="inline-grid h-8 w-8 place-items-center rounded-lg bg-slate-900 text-white">
              <School className="h-5 w-5" />
            </span>
          )}
          <span>{siteName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {items.map((it) => (
            <Item key={it.to} {...it} />
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl hover:bg-slate-100"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          ref={btnRef}
          aria-label={open ? "Tutup menu" : "Buka menu"}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`md:hidden border-t bg-white transition-[max-height,opacity] duration-200 overflow-hidden ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-4 py-2 grid gap-1">
          {items.map((it) => (
            <Item key={`m-${it.to}`} {...it} />
          ))}
        </div>
      </div>
    </header>
  );
}
