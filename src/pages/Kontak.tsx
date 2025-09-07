import Container from "@/components/common/Container";
import Label from "@/components/ui/Label";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";

export default function Kontak() {
  return (
    <Container>
      <h1 className="text-3xl font-bold my-6">Kontak</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-2 text-slate-600">
          <div>
            <span className="font-semibold">Alamat: </span>Jl. Pendidikan No.
            123, Kota
          </div>
          <div>
            <span className="font-semibold">Telepon: </span>(021) 555-1234
          </div>
          <div>
            <span className="font-semibold">Email: </span>
            info@namasekolah.sch.id
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <Label htmlFor="name">Nama</Label>
            <Input id="name" placeholder="Nama lengkap" />
          </div>
          <div>
            <Label htmlFor="message">Pesan</Label>
            <Textarea id="message" rows={4} placeholder="Tulis pesan anda..." />
          </div>
          <Button>Kirim</Button>
          <div className="pt-2 text-xs text-slate-500">
            * Pastikan semua kolom terisi dengan benar.
          </div>
        </form>
      </div>
    </Container>
  );
}
