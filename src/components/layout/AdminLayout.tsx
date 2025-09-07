// src/components/layout/AdminLayout.tsx
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { useEffect, useMemo } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { useAuth } from "@/store/auth";

function prettifySegment(seg: string) {
  if (!seg) return "";
  // kalau segmen terlihat seperti id panjang (uuid/slug panjang), labelkan "Detail"
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

  // default: kapitalisasi tiap kata terhubung tanda minus
  return seg
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const { user, status, init } = useAuth();

  // inisialisasi auth store saat pertama render
  useEffect(() => {
    if (status === "idle") void init();
  }, [status, init]);

  // buat judul/topbar dari path
  const title = useMemo(() => {
    const trimmed = pathname.replace(/^\/admin\/?/, "");
    if (!trimmed) return "Panel Admin";
    const parts = trimmed.split("/").filter(Boolean).map(prettifySegment);
    return parts.join(" / ");
  }, [pathname]);

  // update tab title browser
  useEffect(() => {
    document.title = title === "Panel Admin" ? title : `Admin / ${title}`;
  }, [title]);

  // tampilkan spinner saat status auth belum siap
  if (status === "idle") {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600">
          <span className="h-3 w-3 animate-pulse rounded-full bg-violet-500" />
          <span>Memuat panel admin…</span>
        </div>
      </div>
    );
  }

  // redirect ke login jika belum ada sesi
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="min-h-screen flex">
        <AdminSidebar />
        <main className="flex-1">
          <AdminTopbar title={title} />
          <div className="mx-auto max-w-6xl p-4 md:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
