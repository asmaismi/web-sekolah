import { useEffect, useState, type FormEvent } from "react";
import Section from "@/components/common/Section";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import AdminOnly from "@/components/admin/AdminOnly";
import useUI from "@/store/ui";
import {
  getSettings,
  updateSettings,
  type SiteSettings,
} from "@/services/settings";
import { uploadImage } from "@/lib/upload";

type Form = {
  site_name: string;
  tagline: string;
  profile_image_url: string | null;
  profile_file: File | null;
  profile_text: string;
  vision: string;
  mission: string;
};

export default function ProfilEditor() {
  const addToast = useUI((s) => s.add);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Form>({
    site_name: "",
    tagline: "",
    profile_image_url: null,
    profile_file: null,
    profile_text: "",
    vision: "",
    mission: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const s = await getSettings();
        setData({
          site_name: s.site_name || "",
          tagline: s.tagline || "",
          profile_image_url: s.profile_image_url || null,
          profile_file: null,
          profile_text: s.profile_text || "",
          vision: s.vision || "",
          mission: s.mission || "",
        });
      } catch (e: any) {
        addToast(e?.message || "Gagal memuat data profil");
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      let profile_image_url = data.profile_image_url || null;
      if (data.profile_file) {
        profile_image_url = await uploadImage(data.profile_file);
      }

      const payload: Partial<SiteSettings> = {
        site_name: data.site_name.trim(),
        tagline: data.tagline.trim(),
        profile_image_url,
        profile_text: data.profile_text.trim(),
        vision: data.vision.trim(),
        mission: data.mission.trim(),
      };

      await updateSettings(payload);
      addToast("Profil sekolah disimpan");
    } catch (e: any) {
      addToast(e?.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminOnly>
      <Section title="Profil Sekolah">
        <form
          onSubmit={onSubmit}
          className="space-y-6 bg-white border rounded-xl p-4 md:p-6"
        >
          <div className="grid md:grid-cols-3 gap-6">
            {/* Kartu Gambar (kiri) */}
            <div className="md:col-span-1">
              <Label>Foto/Ilustrasi</Label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    profile_file: e.target.files?.[0] ?? null,
                  }))
                }
                className="mt-1 block w-full text-sm file:mr-3 file:rounded-lg file:border file:bg-slate-50 file:px-3 file:py-2"
              />
              {data.profile_image_url && (
                <figure className="mt-3 rounded-xl border overflow-hidden bg-slate-50">
                  <img
                    src={data.profile_image_url}
                    className="w-full h-auto object-cover"
                    alt="Profil"
                  />
                </figure>
              )}
            </div>

            {/* Isi (kanan) */}
            <div className="md:col-span-2 grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="site_name">Nama Sekolah</Label>
                  <Input
                    id="site_name"
                    value={data.site_name}
                    onChange={(e) =>
                      setData((d) => ({ ...d, site_name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={data.tagline}
                    onChange={(e) =>
                      setData((d) => ({ ...d, tagline: e.target.value }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="profile_text">Profil Singkat</Label>
                <Textarea
                  id="profile_text"
                  rows={5}
                  value={data.profile_text}
                  onChange={(e) =>
                    setData((d) => ({ ...d, profile_text: e.target.value }))
                  }
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vision">Visi</Label>
                  <Textarea
                    id="vision"
                    rows={4}
                    value={data.vision}
                    onChange={(e) =>
                      setData((d) => ({ ...d, vision: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="mission">Misi</Label>
                  <Textarea
                    id="mission"
                    rows={4}
                    value={data.mission}
                    onChange={(e) =>
                      setData((d) => ({ ...d, mission: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </form>
      </Section>
    </AdminOnly>
  );
}
