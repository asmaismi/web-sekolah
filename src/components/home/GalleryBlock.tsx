// src/components/home/GalleryBlock.tsx
import type { GalleryItem } from "@/services/gallery";

type Props = {
  galeri?: GalleryItem[];
  limit?: number;
};

export default function GalleryBlock({ galeri = [], limit }: Props) {
  const data = limit ? galeri.slice(0, limit) : galeri;

  if (!data.length) {
    return <div className="text-slate-500">Belum ada foto yang dipublish.</div>;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((g) => (
        <li
          key={g.id}
          className="rounded-2xl overflow-hidden border bg-white hover:shadow-card transition"
        >
          <figure className="aspect-[4/3] bg-slate-100">
            <img
              src={g.image_url}
              alt={g.title ?? ""}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </figure>
          {(g.title || g.caption) && (
            <div className="p-3 text-sm">
              <div className="font-medium truncate">{g.title}</div>
              <div className="text-slate-600 line-clamp-2">{g.caption}</div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
