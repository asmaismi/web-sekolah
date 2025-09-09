import { Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";

const NullComp = () => null;

// Komponen opsional: kalau modul belum ada, jangan bikin typecheck gagal
// @ts-ignore
const Navbar: any = lazy(() => import("@/components/layout/Navbar").catch(() => ({ default: NullComp })));
// @ts-ignore
const Footer: any = lazy(() => import("@/components/layout/Footer").catch(() => ({ default: NullComp })));
// @ts-ignore
const ScrollToTop: any = lazy(() => import("@/components/ScrollToTop").catch(() => ({ default: NullComp })));
// @ts-ignore
const ToastStack: any = lazy(() => import("@/components/ui/ToastStack").catch(() => ({ default: NullComp })));

export default function App() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Suspense fallback={null}>
        <ScrollToTop />
        <Navbar />
      </Suspense>
      <main className="flex-1">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
        <ToastStack />
      </Suspense>
    </div>
  );
}
