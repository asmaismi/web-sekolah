import Container from '@/components/common/Container'


export default function Kontak() {
return (
<Container>
<h1 className="text-3xl font-bold my-6">Kontak</h1>
<div className="grid md:grid-cols-2 gap-8">
<div className="space-y-2 text-slate-600">
<div><span className="font-semibold">Alamat: </span>Jl. Pendidikan No. 123, Kota</div>
<div><span className="font-semibold">Telepon: </span>(021) 555-1234</div>
<div><span className="font-semibold">Email: </span>info@namasekolah.sch.id</div>
</div>
<form className="space-y-4">
<div>
<label className="block text-sm">Nama</label>
<input className="w-full mt-1 border rounded-xl px-3 py-2" />
</div>
<div>
<label className="block text-sm">Pesan</label>
<textarea className="w-full mt-1 border rounded-xl px-3 py-2" rows={4} />
</div>
<button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold">Kirim</button>
</form>
</div>
</Container>
)
}