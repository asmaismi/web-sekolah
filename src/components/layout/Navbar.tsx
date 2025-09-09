// src/components/layout/Navbar.tsx
import { useSettings } from "@/store/settings";
import {
  CalendarDays, GraduationCap,
  Home, IdCard,
  Images,
  Layers, Newspaper,
  Phone
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

type IconType = React.ComponentType<{ size?: number | string; className?: string }>;

type ItemDef = {
  to: string;
  label: string;
  end?: boolean;
  Icon: IconType;
  gradient: string;
};

const ICON_SIZE = 14;
const BADGE_CLASS = "shrink-0 grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br text-white shadow-sm";

export default function Navbar() {
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  // Settings
  const { data: settings, refresh } = useSettings();
  useEffect(() => {
    if (!settings) refresh();
  }, [settings, refresh]);

  const siteName = settings?.site_name || "Nama Sekolah";
  const logoUrl = settings?.logo_url || "";

  const navItem = "inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm text-slate-700 hover:bg-slate-100";
  const active = "bg-slate-100 text-slate-900 font-semibold";

  const items: ItemDef[] = [
    { to: "/", label: "Beranda", end: true, Icon: Home, gradient: "from-sky-500 to-cyan-500" },
    { to: "/profil", label: "Profil", Icon: IdCard, gradient: "from-emerald-500 to-teal-500" },
    { to: "/program", label: "Program", Icon: Layers, gradient: "from-indigo-500 to-blue-500" },
    { to: "/berita", label: "Berita", Icon: Newspaper, gradient: "from-violet-500 to-fuchsia-500" },
    { to: "/galeri", label: "Galeri", Icon: Images, gradient: "from-pink-500 to-rose-500" },
    { to: "/agenda", label: "Agenda", Icon: CalendarDays, gradient: "from-purple-500 to-violet-600" },
    { to: "/ppdb", label: "PPDB", Icon: GraduationCap, gradient: "from-amber-500 to-orange-500" },
    { to: "/kontak", label: "Kontak", Icon: Phone, gradient: "from-slate-500 to-zinc-600" },
  ];

  const Item = ({ to, label, end, Icon, gradient }: ItemDef) => (
    <NavLink to={to} end={!!end} className={({ isActive }) => `${navItem} ${isActive ? active : ""}`} onClick={() => setOpen(false)}>
      <span className={`${BADGE_CLASS} ${"bg-gradient-to-br " + gradient}`}>
        <Icon size={ICON_SIZE} />
      </span>
      <span className="truncate">{label}</span>
    </NavLink>
  );

  // (sisanya biarkan seperti filemu)
}
