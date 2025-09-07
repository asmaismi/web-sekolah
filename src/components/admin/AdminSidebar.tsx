import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import {
  LayoutDashboard,
  Newspaper,
  Tag,
  Megaphone,
  Images,
  CalendarDays,
  ImagePlus,
  School,
  Settings,
  LogOut,
  Clapperboard,
  Home,
} from "lucide-react";

const itemBase =
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition";
const itemIdle = "text-slate-700 hover:bg-slate-100";
const itemActive =
  "bg-violet-50 text-violet-700 border border-violet-200 shadow-sm";
const ICON_SIZE = 14;
const badge = (grad: string) =>
  `shrink-0 grid h-6 w-6 place-items-center rounded-full text-white bg-gradient-to-br ${grad} shadow`;

type Item = {
  to: string;
  label: string;
  end?: boolean;
  grad: string;
  Icon: React.ComponentType<{ size?: number }>;
};

export default function AdminSidebar() {
  const navigate = useNavigate();
  const logout = useAuth((s) => s.logout);

  const items: Item[] = [
    {
      to: "/admin",
      label: "Dashboard",
      end: true,
      Icon: LayoutDashboard,
      grad: "from-sky-500 to-cyan-500",
    },
    {
      to: "/admin/berita",
      label: "Berita",
      Icon: Newspaper,
      grad: "from-violet-500 to-fuchsia-500",
    },
    {
      to: "/admin/kategori",
      label: "Kategori",
      Icon: Tag,
      grad: "from-emerald-500 to-teal-500",
    },
    {
      to: "/admin/pengumuman",
      label: "Pengumuman",
      Icon: Megaphone,
      grad: "from-amber-500 to-orange-500",
    },
    {
      to: "/admin/galeri",
      label: "Galeri",
      Icon: Images,
      grad: "from-pink-500 to-rose-500",
    },
    {
      to: "/admin/galeri-publish",
      label: "Galeri Publish",
      Icon: ImagePlus,
      grad: "from-indigo-500 to-blue-500",
    },
    {
      to: "/admin/acara",
      label: "Acara",
      Icon: CalendarDays,
      grad: "from-purple-500 to-violet-600",
    },
    {
      to: "/admin/profil",
      label: "Profil Sekolah",
      Icon: School,
      grad: "from-slate-500 to-zinc-600",
    },
    {
      to: "/admin/hero",
      label: "Hero",
      Icon: Clapperboard,
      grad: "from-sky-600 to-indigo-600",
    },
    {
      to: "/admin/home",
      label: "Homepage",
      Icon: Home,
      grad: "from-teal-500 to-emerald-600",
    },
    {
      to: "/admin/settings",
      label: "Settings",
      Icon: Settings,
      grad: "from-slate-400 to-slate-600",
    },
  ];

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/admin/login");
    }
  }

  return (
    <aside className="hidden md:block w-64 shrink-0 border-r bg-white">
      <div className="p-4">
        <div className="text-lg font-semibold">Panel Admin</div>
      </div>
      <nav className="p-2 space-y-1">
        {items.map(({ to, label, end, Icon, grad }) => (
          <NavLink
            key={to}
            to={to}
            end={!!end}
            className={({ isActive }) =>
              `${itemBase} ${isActive ? itemActive : itemIdle}`
            }
          >
            <span className={badge(grad)}>
              <Icon size={ICON_SIZE} />
            </span>
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
        <button
          type="button"
          onClick={handleLogout}
          className={`${itemBase} ${itemIdle} w-full text-left mt-1`}
          aria-label="Logout"
        >
          <span className={badge("from-slate-400 to-slate-600")}>
            <LogOut size={ICON_SIZE} />
          </span>
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
