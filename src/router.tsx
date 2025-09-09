// Router synced to src/pages/admin/* from src.zip
import { createBrowserRouter } from "react-router-dom";
import { lazy, type ComponentType } from "react";
import App from "./App";
import AdminLayout from "@/components/layout/AdminLayout";

function Null() { return null; }

function lazySafe<T extends ComponentType<any>>(loader: () => Promise<{ default?: T }>) {
  return lazy(async () => {
    try {
      const mod = await loader();
      const Comp = (mod && (mod as any).default) as T | undefined;
      return { default: (Comp ?? (Null as any)) as T };
    } catch {
      return { default: (Null as any) as T };
    }
  });
}

// ---------- Public pages ----------
/* @ts-ignore */ const Home = lazySafe(() => import("./pages/Home"));
/* @ts-ignore */ const Profil = lazySafe(() => import("./pages/Profil"));
/* @ts-ignore */ const Program = lazySafe(() => import("./pages/Program"));
/* @ts-ignore */ const BeritaList = lazySafe(() => import("./pages/BeritaList"));
/* @ts-ignore */ const BeritaDetail = lazySafe(() => import("./pages/BeritaDetail"));
/* @ts-ignore */ const Galeri = lazySafe(() => import("./pages/Galeri"));
/* @ts-ignore */ const PPDB = lazySafe(() => import("./pages/PPDB"));
/* @ts-ignore */ const Kontak = lazySafe(() => import("./pages/Kontak"));
/* @ts-ignore */ const Agenda = lazySafe(() => import("./pages/Agenda"));
/* @ts-ignore */ const AgendaDetail = lazySafe(() => import("./pages/AgendaDetail"));

// ---------- Admin pages (src/pages/admin/*) ----------
/* @ts-ignore */ const ALogin = lazySafe(() => import("./pages/admin/Login"));
/* @ts-ignore */ const ADashboard = lazySafe(() => import("./pages/admin/Dashboard"));
/* @ts-ignore */ const ANewsList = lazySafe(() => import("./pages/admin/NewsList"));
/* @ts-ignore */ const ANewsForm = lazySafe(() => import("./pages/admin/NewsForm"));
/* @ts-ignore */ const AKategoriList = lazySafe(() => import("./pages/admin/KategoriList"));
/* @ts-ignore */ const AKategoriForm = lazySafe(() => import("./pages/admin/KategoriForm"));
/* @ts-ignore */ const APengumumanList = lazySafe(() => import("./pages/admin/PengumumanList"));
/* @ts-ignore */ const APengumumanForm = lazySafe(() => import("./pages/admin/PengumumanForm"));
/* @ts-ignore */ const AGaleriList = lazySafe(() => import("./pages/admin/GaleriList"));
/* @ts-ignore */ const AGaleriForm = lazySafe(() => import("./pages/admin/GaleriForm"));
/* @ts-ignore */ const AGaleriPublish = lazySafe(() => import("./pages/admin/GaleriPublish"));
/* @ts-ignore */ const AAcaraForm = lazySafe(() => import("./pages/admin/AcaraForm"));
/* @ts-ignore */ const AProfilEditor = lazySafe(() => import("./pages/admin/ProfilEditor"));
/* @ts-ignore */ const AHeroSettings = lazySafe(() => import("./pages/admin/HeroSettings"));
/* @ts-ignore */ const AHomeSettings = lazySafe(() => import("./pages/admin/HomeSettings"));
/* @ts-ignore */ const AMediaLibrary = lazySafe(() => import("./pages/admin/MediaLibrary"));
/* @ts-ignore */ const ASettings = lazySafe(() => import("./pages/admin/Settings"));

const router = createBrowserRouter([
  // Admin login (no layout)
  { path: "/admin/login", element: <ALogin /> },

  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "profil", element: <Profil /> },
      { path: "program", element: <Program /> },
      { path: "berita", element: <BeritaList /> },
      { path: "berita/:slug", element: <BeritaDetail /> },
      { path: "galeri", element: <Galeri /> },
      { path: "ppdb", element: <PPDB /> },
      { path: "kontak", element: <Kontak /> },
      { path: "agenda", element: <Agenda /> },
      { path: "agenda/:slug", element: <AgendaDetail /> },
    ],
  },

  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <ADashboard /> },

      // Berita
      { path: "berita", element: <ANewsList /> },
      { path: "berita/tambah", element: <ANewsForm /> },
      { path: "berita/:id", element: <ANewsForm /> },

      // Kategori
      { path: "kategori", element: <AKategoriList /> },
      { path: "kategori/tambah", element: <AKategoriForm /> },
      { path: "kategori/:id", element: <AKategoriForm /> },

      // Pengumuman
      { path: "pengumuman", element: <APengumumanList /> },
      { path: "pengumuman/tambah", element: <APengumumanForm /> },
      { path: "pengumuman/:id", element: <APengumumanForm /> },

      // Galeri
      { path: "galeri", element: <AGaleriList /> },
      { path: "galeri/tambah", element: <AGaleriForm /> },
      { path: "galeri/:id", element: <AGaleriForm /> },
      { path: "galeri-publish", element: <AGaleriPublish /> },

      // Acara
      { path: "acara", element: <AAcaraForm /> },

      // Lain-lain
      { path: "profil", element: <AProfilEditor /> },
      { path: "hero", element: <AHeroSettings /> },
      { path: "home", element: <AHomeSettings /> },
      { path: "media", element: <AMediaLibrary /> },
      { path: "settings", element: <ASettings /> },
    ],
  },

  { path: "*", element: <Null /> },
]);

export default router;
