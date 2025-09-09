// src/pages/admin/Settings.tsx — versi rapi + styling
import AdminOnly from "@/components/admin/AdminOnly";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Textarea from "@/components/ui/Textarea";
import { uploadImage } from "@/lib/upload";
import { getSettings, updateSettings, type SiteSettings } from "@/services/settings";
import useUI from "@/store/ui";
import { useEffect, useState, type FormEvent } from "react";

type Form = {
  site_name: string;
  tagline: string;
  logo_url: string | null;
  logo_file: File | null;
  primary_color: string;
  contact_email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
};

export default function Settings() {
  const toast = useUI((s) => s.add);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Form>({
    site_name: "",
    tagline: "",
    logo_url: null,
    logo_file: null,
    primary_color: "",
    contact_email: "",
    phone: "",
    address: "",
    facebook: "",
    instagram: "",
    youtube: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const s = await getSettings();
        setData({
          site_name: s.site_name || "",
          tagline: s.tagline || "",
          logo_url: s.logo_url || null,
          logo_file: null,
          primary_color: s.primary_color || "",
          contact_email: s.contact_email || "",
          phone: s.phone || "",
          address: s.address || "",
          facebook: s.facebook || "",
          instagram: s.instagram || "",
          youtube: s.youtube || "",
        });
      } catch (e: any) {
        toast(e?.message || "Gagal memuat pengaturan");
      }
    })();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      let logo_url = data.logo_url || null;
      if (data.logo_file) {
        logo_url = await uploadImage(data.logo_file);
      }

      const payload: Partial<SiteSettings> = {
        site_name: data.site_name.trim(),
        tagline: data.tagline.trim(),
        logo_url,
        primary_color: data.primary_color.trim() || null,
        contact_email: data.contact_email.trim() || null,
        phone: data.phone.trim() || null,
        address: data.address.trim() || null,
        facebook: data.facebook.trim() || null,
        instagram: data.instagram.trim() || null,
        youtube: data.youtube.trim() || null,
      };

      await updateSettings(payload);
      toast("Pengaturan disimpan");
    } catch (e: any) {
      toast(e?.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminOnly>
      <div className="mx-auto max-w-5xl px-4 py-3 md:py-4">
        {/* Header ringkas & rapat ke atas */}
        <div className="mb-3 md:mb-4 flex items-start justify-between">
          <div>
            <h1 className="text-sm font-semibold text-slate-800">Pengaturan Situs</h1>
            <p className="text-xs text-slate-500">Identitas, kontak, dan sosial media.</p>
          </div>
          <div className="hidden md:block">
            <Button form="site-settings-form" type="submit" disabled={loading}>
              {loading ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </div>

        {/* Kartu Form */}
        <form
          id="site-settings-form"
          onSubmit={onSubmit}
          className="space-y-8 rounded-2xl border bg-white p-4 shadow-sm md:p-6"
        >
          {/* Identitas */}
          <section>
            <div className="mb-3 text-sm font-semibold text-slate-700">Identitas Situs</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="site_name">Nama Sekolah</Label>
                <Input
                  id="site_name"
                  value={data.site_name}
                  onChange={(e) => setData((d) => ({ ...d, site_name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={data.tagline}
                  onChange={(e) => setData((d) => ({ ...d, tagline: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="primary_color">Warna Utama</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primary_color"
                    placeholder="#6d28d9"
                    value={data.primary_color}
                    onChange={(e) => setData((d) => ({ ...d, primary_color: e.target.value }))}
                    className="font-mono"
                  />
                  <input
                    aria-label="Color picker"
                    type="color"
                    value={/^#([0-9a-f]{6}|[0-9a-f]{3})$/i.test(data.primary_color || "") ? data.primary_color : "#6d28d9"}
                    onChange={(e) => setData((d) => ({ ...d, primary_color: e.target.value }))}
                    className="h-10 w-10 cursor-pointer rounded-lg border"
                  />
                </div>
              </div>

              <div>
                <Label>Logo</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setData((d) => ({ ...d, logo_file: e.target.files?.[0] ?? null }))}
                  className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:bg-slate-50 file:px-3 file:py-2"
                />
                {data.logo_url && (
                  <img
                    src={data.logo_url}
                    alt="logo"
                    className="mt-3 h-16 rounded-lg border bg-white p-2 object-contain"
                  />
                )}
              </div>
            </div>
          </section>

          {/* Kontak */}
          <section>
            <div className="mb-3 text-sm font-semibold text-slate-700">Kontak</div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  value={data.contact_email}
                  onChange={(e) => setData((d) => ({ ...d, contact_email: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="phone">Telepon</Label>
                <Input id="phone" value={data.phone} onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))} />
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  rows={3}
                  value={data.address}
                  onChange={(e) => setData((d) => ({ ...d, address: e.target.value }))}
                />
              </div>
            </div>
          </section>

          {/* Sosial Media */}
          <section>
            <div className="mb-3 text-sm font-semibold text-slate-700">Sosial Media</div>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/..."
                  value={data.facebook}
                  onChange={(e) => setData((d) => ({ ...d, facebook: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/..."
                  value={data.instagram}
                  onChange={(e) => setData((d) => ({ ...d, instagram: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  placeholder="https://youtube.com/..."
                  value={data.youtube}
                  onChange={(e) => setData((d) => ({ ...d, youtube: e.target.value }))}
                />
              </div>
            </div>
          </section>

          {/* Tombol simpan (mobile) */}
          <div className="md:hidden">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Menyimpan…" : "Simpan"}
            </Button>
          </div>
        </form>
      </div>
    </AdminOnly>
  );
}
