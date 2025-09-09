// src/components/layout/AdminLayout.tsx
import { Outlet, useLocation } from "react-router-dom";
import { useMemo, Suspense, lazy } from "react";
import ProbeBoundary from "@/lib/ProbeBoundary";

const NullComp = () => null;

// @ts-ignore
const AdminSidebar: any = lazy(() => import("@/components/admin/AdminSidebar").catch(() => ({ default: NullComp })));
// @ts-ignore
const AdminTopbar: any = lazy(() => import("@/components/admin/AdminTopbar").catch(() => ({ default: NullComp })));

function prettifySegment(seg: string) {
  if (!seg) return "";
  const isIdish = seg.length > 12 && /^[a-z0-9-]+$/i.test(seg);
  if (isIdish) return "Detail";

  const map: Record<string, string> = {
    tambah: "Tambah",
    edit: "Edit",
    settings: "Settings",
    profil: "Profil",
    hero: "Hero",
    home: "Home",
    "galeri-publish": "Galeri Publish",
  };
  if ((map as any)[seg]) return (map as any)[seg];
  return seg.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export default function AdminLayout() {
  const { pathname } = useLocation();
  const titleRaw = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    const adminIdx = parts.indexOf("admin");
    const tail = adminIdx >= 0 ? parts.slice(adminIdx + 1) : parts;
    return tail.map(prettifySegment).filter(Boolean).join(" / ") || "Dashboard";
  }, [pathname]);

  const title = typeof titleRaw === "string" ? titleRaw : String(titleRaw ?? "");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="min-h-screen flex">
        <Suspense fallback={null}>
          <ProbeBoundary name="AdminSidebar">
            <AdminSidebar />
          </ProbeBoundary>
        </Suspense>
        <main className="flex-1">
          <Suspense fallback={null}>
            <ProbeBoundary name="AdminTopbar">
              <AdminTopbar title={title} />
            </ProbeBoundary>
          </Suspense>
          <div className="mx-auto max-w-6xl p-4 md:p-6">
            <ProbeBoundary name="AdminOutlet">
              <Outlet />
            </ProbeBoundary>
          </div>
        </main>
      </div>
    </div>
  );
}
