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
  const addToast = useUI((s) => s.add);
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
        addToast(e?.message || "Gagal memuat pengaturan");
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
      addToast("Pengaturan disimpan");
    } catch (e: any) {
      addToast(e?.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminOnly>
      <Section title="Settings">
        <form
          onSubmit={onSubmit}
          className="space-y-6 bg-white border rounded-xl p-4 md:p-6"
        >
          {/* Identitas */}
          <div>
            <div className="text-lg font-semibold mb-3">Identitas Situs</div>
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
              <div>
                <Label htmlFor="primary_color">Warna Utama (hex)</Label>
                <Input
                  id="primary_color"
                  placeholder="#6d28d9"
                  value={data.primary_color}
                  onChange={(e) =>
                    setData((d) => ({ ...d, primary_color: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>Logo</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setData((d) => ({
                      ...d,
                      logo_file: e.target.files?.[0] ?? null,
                    }))
                  }
                  className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:bg-slate-50 file:px-3 file:py-2"
                />
                {data.logo_url && (
                  <img
                    src={data.logo_url}
                    alt="logo"
                    className="mt-3 h-16 object-contain rounded-lg border bg-white p-2"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Kontak */}
          <div>
            <div className="text-lg font-semibold mb-3">Kontak</div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="contact_email">Email</Label>
                <Input
                  id="contact_email"
                  value={data.contact_email}
                  onChange={(e) =>
                    setData((d) => ({ ...d, contact_email: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="phone">Telepon</Label>
                <Input
                  id="phone"
                  value={data.phone}
                  onChange={(e) =>
                    setData((d) => ({ ...d, phone: e.target.value }))
                  }
                />
              </div>
              <div className="md:col-span-3">
                <Label htmlFor="address">Alamat</Label>
                <Textarea
                  id="address"
                  rows={3}
                  value={data.address}
                  onChange={(e) =>
                    setData((d) => ({ ...d, address: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Sosial Media */}
          <div>
            <div className="text-lg font-semibold mb-3">Sosial Media</div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/..."
                  value={data.facebook}
                  onChange={(e) =>
                    setData((d) => ({ ...d, facebook: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  placeholder="https://instagram.com/..."
                  value={data.instagram}
                  onChange={(e) =>
                    setData((d) => ({ ...d, instagram: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="youtube">YouTube</Label>
                <Input
                  id="youtube"
                  placeholder="https://youtube.com/..."
                  value={data.youtube}
                  onChange={(e) =>
                    setData((d) => ({ ...d, youtube: e.target.value }))
                  }
                />
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
