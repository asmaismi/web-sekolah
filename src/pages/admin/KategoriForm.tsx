import { useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Section from "../../components/common/Section";
import Label from "../../components/ui/Label";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import useUI from "../../store/ui";
import {
  createCategory,
  getCategoryById,
  updateCategory,
  slugifyCategory,
  type Category,
} from "../../services/categories";
import AdminOnly from "../../components/admin/AdminOnly";

type Form = { name: string; slug: string };

export default function KategoriForm() {
  const nav = useNavigate();
  const { id } = useParams();
  const addToast = useUI((s) => s.add);

  const [data, setData] = useState<Form>({ name: "", slug: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const row: Category = await getCategoryById(id);
        setData({ name: row.name, slug: row.slug });
      } catch (e: any) {
        addToast(e?.message || "Gagal memuat data");
      }
    })();
  }, [id]);

  function toSlug(s: string) {
    return slugifyCategory(s);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: data.name.trim(),
        slug: (data.slug.trim() || toSlug(data.name)).trim(),
      };
      if (!payload.name) throw new Error("Nama wajib diisi");
      if (!payload.slug) throw new Error("Slug wajib diisi");

      if (id) {
        await updateCategory(id, payload);
        addToast("Kategori diperbarui");
      } else {
        await createCategory(payload);
        addToast("Kategori ditambahkan");
      }
      nav("/admin/kategori");
    } catch (e: any) {
      addToast(e?.message || "Gagal menyimpan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminOnly>
      <Section title={id ? "Edit Kategori" : "Tambah Kategori"}>
        <form
          onSubmit={onSubmit}
          className="space-y-5 bg-white border rounded-xl p-4 md:p-6"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nama *</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) =>
                  setData((d) => ({
                    ...d,
                    name: e.target.value,
                    slug: d.slug || toSlug(e.target.value),
                  }))
                }
                placeholder="Contoh: Prestasi"
              />
            </div>
            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={data.slug}
                onChange={(e) =>
                  setData((d) => ({ ...d, slug: toSlug(e.target.value) }))
                }
                placeholder="prestasi"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Menyimpan…" : "Simpan"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => nav("/admin/kategori")}
            >
              Batal
            </Button>
          </div>
        </form>
      </Section>
    </AdminOnly>
  );
}
