import { useEffect, useState } from "react";
import Section from "../../components/common/Section";
import { mockApi } from "../../mock/service";
import type { News, Event as AppEvent, GalleryItem } from "../../mock/types"; // ⟵ aliasin Event jadi AppEvent
// Hapus import Card karena tidak dipakai dan kemungkinan filenya tidak ada

export default function Dashboard() {
  const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);

  useEffect(() => {
    mockApi.listNews().then(setNews);
    mockApi.listEvents().then(setEvents);
    mockApi.listGallery().then(setGallery);
  }, []);

  const cards = [
    { label: "Berita", total: news.length },
    { label: "Acara", total: events.length },
    { label: "Galeri", total: gallery.length },
  ];

  return (
    <Section title="Dashboard" subtitle="Ringkasan konten situs.">
      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((x) => (
          <div key={x.label} className="p-6 bg-white border rounded-2xl">
            <div className="text-sm text-slate-500">{x.label}</div>
            <div className="mt-1 text-3xl font-extrabold">{x.total}</div>
          </div>
        ))}
      </div>
    </Section>
  );
}
