import { useEffect, useState } from "react";
import Section from "@/components/common/Section";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import useUI from "@/store/ui";
import AdminOnly from "@/components/admin/AdminOnly";
import { supabase } from "@/lib/supabase";

type FileRow = {
  id: string;
  name: string;
  fullPath: string;
  url: string;
  created_at?: string;
  updated_at?: string;
  size?: number;
};

const BUCKET = "images";

export default function MediaLibrary() {
  const addToast = useUI((s) => s.add);
  const [files, setFiles] = useState<FileRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");

  async function load() {
    setLoading(true);
    try {
      // list root folder
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list("", {
          limit: 1000,
          offset: 0,
          sortBy: { column: "name", order: "asc" },
        });
      if (error) throw error;

      const rows: FileRow[] = (data ?? [])
        .filter((d: any) => d.name && !d.name.endsWith("/"))
        .map((d: any) => {
          const fullPath = d.name as string;
          const { data: pub } = supabase.storage
            .from(BUCKET)
            .getPublicUrl(fullPath);
          return {
            id: fullPath,
            name: d.name,
            fullPath,
            url: pub.publicUrl,
            created_at: d.created_at,
            updated_at: d.updated_at,
            size: d.metadata?.size,
          };
        });

      setFiles(rows);
    } catch (e: any) {
      addToast(e?.message || "Gagal memuat media");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const ext = f.name.split(".").pop();
      const filename = `media_${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(filename, f, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) throw error;
      addToast("Berhasil upload");
      await load();
    } catch (e: any) {
      addToast(e?.message || "Gagal upload");
    } finally {
      e.target.value = "";
    }
  }

  function filtered() {
    const qq = q.trim().toLowerCase();
    if (!qq) return files;
    return files.filter((f) => f.name.toLowerCase().includes(qq));
  }

  async function remove(path: string) {
    if (!confirm("Hapus file ini?")) return;
    try {
      const { error } = await supabase.storage.from(BUCKET).remove([path]);
      if (error) throw error;
      addToast("Berhasil dihapus");
      await load();
    } catch (e: any) {
      addToast(e?.message || "Gagal menghapus");
    }
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      addToast("URL disalin ke clipboard");
    } catch {
      addToast("Tidak bisa menyalin URL");
    }
  }

  return (
    <AdminOnly>
      <Section title="Media Library">
        <div className="mb-4 flex items-center gap-3">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama file…"
            className="w-64"
          />
          <label className="ml-auto">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onUpload}
            />
            <span className="inline-flex rounded-xl border bg-white px-3 py-2 text-sm cursor-pointer hover:bg-slate-50">
              Upload
            </span>
          </label>
        </div>

        {loading ? (
          <div className="p-6 text-slate-500">Memuat…</div>
        ) : filtered().length === 0 ? (
          <div className="p-6 text-slate-500">Belum ada file.</div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered().map((f) => (
              <li key={f.id} className="rounded-xl border bg-white p-2">
                <figure className="aspect-video overflow-hidden rounded-lg border bg-slate-50">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <img src={f.url} className="h-full w-full object-cover" />
                </figure>
                <div className="mt-2 text-xs truncate" title={f.name}>
                  {f.name}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Button variant="outline" onClick={() => copy(f.url)}>
                    Salin URL
                  </Button>
                  <Button variant="danger" onClick={() => remove(f.fullPath)}>
                    Hapus
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </AdminOnly>
  );
}
