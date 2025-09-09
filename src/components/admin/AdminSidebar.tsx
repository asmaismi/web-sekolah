// src/components/admin/AdminSidebar.tsx
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Tags,
  Megaphone,
  Image as ImageIcon,
  Images,
  UploadCloud,
  CalendarDays,
  GraduationCap,
  Sparkles,
  Home,
  Settings,
  LogOut,
} from "lucide-react";
import React from "react";

// ====== styling tokens (match look sebelumnya) ======
const itemBase = "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition";
const itemIdle = "text-slate-700 hover:bg-slate-100";
const itemActive = "bg-violet-50 text-violet-700 border border-violet-200 shadow-sm";
const ICON_SIZE = 14;
const badge = (grad: string) =>
  `shrink-0 grid h-6 w-6 place-items-center rounded-full text-white bg-gradient-to-br ${grad} shadow`;

// ====== helpers aman ======
const cx = (...args: any[]): string =>
  args
    .flat(Infinity)
    .filter(Boolean)
    .map((v) => {
      if (typeof v === "string") return v;
      if (Array.isArray(v)) return cx(...v);
      if (typeof v === "object") {
        return Object.keys(v)
          .filter((k) => (v as any)[k])
          .join(" ");
      }
      return String(v ?? "");
    })
    .join(" ");

// ====== menu ======
type Item = {
  to: string;
  label: string;
  grad: string;
  Icon: React.ComponentType<{ size?: number | string; className?: string }>;
  end?: boolean;
};

const ITEMS: Item[] = [
  { to: "/admin", label: "Dashboard", grad: "from-violet-500 to-fuchsia-500", Icon: LayoutDashboard, end: true },
  { to: "/admin/berita", label: "Berita", grad: "from-sky-500 to-cyan-500", Icon: Newspaper },
  { to: "/admin/kategori", label: "Kategori", grad: "from-indigo-500 to-blue-500", Icon: Tags },
  { to: "/admin/pengumuman", label: "Pengumuman", grad: "from-rose-500 to-orange-500", Icon: Megaphone },
  { to: "/admin/galeri", label: "Galeri", grad: "from-emerald-500 to-teal-500", Icon: Images },
  { to: "/admin/galeri-publish", label: "Galeri Publish", grad: "from-amber-500 to-orange-600", Icon: UploadCloud },
  { to: "/admin/acara", label: "Acara", grad: "from-lime-500 to-green-600", Icon: CalendarDays },
  { to: "/admin/profil", label: "Profil Sekolah", grad: "from-slate-600 to-slate-800", Icon: GraduationCap },
  { to: "/admin/hero", label: "Hero", grad: "from-fuchsia-500 to-pink-500", Icon: Sparkles },
  { to: "/admin/home", label: "Homepage", grad: "from-cyan-500 to-teal-500", Icon: Home },
  { to: "/admin/settings", label: "Settings", grad: "from-gray-600 to-gray-800", Icon: Settings },
  { to: "/admin/logout", label: "Logout", grad: "from-red-500 to-rose-600", Icon: LogOut },
];

export default function AdminSidebar() {
  return (
    <aside className="hidden md:block w-64 shrink-0 border-r bg-white p-3 md:p-4">
      <div className="px-2 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Panel Admin
      </div>
      <nav className="space-y-1">
        {ITEMS.map((it, i) => (
          <NavLink
            key={i}
            to={typeof it.to === "string" ? it.to : "/admin"}
            end={!!it.end}
            className={({ isActive }) => cx(itemBase, isActive ? itemActive : itemIdle)}
          >
            <span className={badge(it.grad)}>
              {it.Icon ? <it.Icon size={ICON_SIZE} className="opacity-90" /> : null}
            </span>
            <span className="truncate">{typeof it.label === "string" ? it.label : String(it.label ?? "")}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
