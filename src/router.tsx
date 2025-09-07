import { createBrowserRouter } from "react-router-dom";

import App from "./App";

// ====== PUBLIC ======
import Home from "./pages/Home";
import Profil from "./pages/Profil";
import Program from "./pages/Program";
import BeritaList from "./pages/BeritaList";
import BeritaDetail from "./pages/BeritaDetail";
import Galeri from "./pages/Galeri";
import PPDB from "./pages/PPDB";
import Kontak from "./pages/Kontak";
import Agenda from "./pages/Agenda";
import AgendaDetail from "./pages/AgendaDetail";

// ====== ADMIN ======
import AdminLayout from "./components/layout/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import KategoriList from "./pages/admin/KategoriList";
import KategoriForm from "./pages/admin/KategoriForm";
import Settings from "./pages/admin/Settings";
import MediaLibrary from "./pages/admin/MediaLibrary";
import ProfilEditor from "./pages/admin/ProfilEditor";
import HeroSettings from "./pages/admin/HeroSettings";
import HomeSettings from "./pages/admin/HomeSettings";
import GaleriPublish from "./pages/admin/GaleriPublish";

// Berita (admin)
import NewsList from "./pages/admin/NewsList";
import NewsForm from "./pages/admin/NewsForm";
import PengumumanList from "./pages/admin/PengumumanList";
import PengumumanForm from "./pages/admin/PengumumanForm";
import AcaraList from "./pages/AcaraList";
import AcaraForm from "./pages/admin/AcaraForm";

// Galeri (admin)
import GaleriList from "./pages/admin/GaleriList";
import GaleriForm from "./pages/admin/GaleriForm";

// (Opsional, nanti diaktifkan setelah siap)
// import AcaraList from './pages/admin/AcaraList'
// import AcaraForm from './pages/admin/AcaraForm'

export const router = createBrowserRouter([
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
      { path: "agenda", element: <Agenda /> },
      { path: "agenda/:slug", element: <AgendaDetail /> },
      { path: "ppdb", element: <PPDB /> },
      { path: "kontak", element: <Kontak /> },
    ],
  },

  // ====== LOGIN ADMIN (tunggal, jangan dobel) ======
  { path: "/admin/login", element: <Login /> },

  // ====== AREA ADMIN (protected lewat layout/guard) ======
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },

      // BERITA
      { path: "berita", element: <NewsList /> },
      { path: "berita/tambah", element: <NewsForm /> },
      { path: "berita/:id/edit", element: <NewsForm /> },

      // GALERI
      { path: "galeri", element: <GaleriList /> },
      { path: "galeri/tambah", element: <GaleriForm /> },
      { path: "galeri/:id/edit", element: <GaleriForm /> },

      // KATEGORI
      { path: "kategori", element: <KategoriList /> },
      { path: "kategori/tambah", element: <KategoriForm /> },
      { path: "kategori/:id/edit", element: <KategoriForm /> },

      // PENGUMUMAN
      { path: "pengumuman", element: <PengumumanList /> },
      { path: "pengumuman/tambah", element: <PengumumanForm /> },
      { path: "pengumuman/:id/edit", element: <PengumumanForm /> },

      { path: "settings", element: <Settings /> },
      { path: "acara", element: <AcaraList /> },
      { path: "acara/tambah", element: <AcaraForm /> },
      { path: "acara/:id/edit", element: <AcaraForm /> },

      // MEDIA
      { path: "media", element: <MediaLibrary /> },

      // SETTINGS (kalau belum ada)
      { path: "settings", element: <Settings /> },
      { path: "profil", element: <ProfilEditor /> },
      { path: "hero", element: <HeroSettings /> },
      { path: "home", element: <HomeSettings /> },
      { path: "galeri-publish", element: <GaleriPublish /> },

      // ACARA (aktifkan kalau file sudah siap)
      // { path: 'acara', element: <AcaraList /> },
      // { path: 'acara/tambah', element: <AcaraForm /> },
      // { path: 'acara/:id/edit', element: <AcaraForm /> },
    ],
  },
]);
