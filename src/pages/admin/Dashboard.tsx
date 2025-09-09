// src/pages/admin/Dashboard.tsx
import HomeQuickControls from "@/pages/admin/HomeQuickControls";

export default function Dashboard() {
  return (
    <div className="relative">
      {/* soft top glow biar nggak flat, tapi tipis aja */}
      <div className="pointer-events-none absolute inset-x-0 -top-16 -z-10 h-24 bg-gradient-to-b from-violet-50 to-transparent" />

      {/* konten mepet ke atas, tanpa heading */}
      <div className="mx-auto max-w-6xl px-4 md:px-6 pt-2 pb-10">
        <HomeQuickControls />
      </div>
    </div>
  );
}
