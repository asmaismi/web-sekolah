import Container from '@/components/common/Container'


export default function PPDB() {
function onSubmit(e: React.FormEvent) { e.preventDefault(); alert('Form dummy terkirim (demo)') }
return (
<Container>
<h1 className="text-3xl font-bold my-6">Pendaftaran Peserta Didik Baru (PPDB)</h1>
<form onSubmit={onSubmit} className="max-w-xl space-y-4 border rounded-2xl p-6">
<div>
<label className="block text-sm">Nama Lengkap</label>
<input className="w-full mt-1 border rounded-xl px-3 py-2" required />
</div>
<div className="grid md:grid-cols-2 gap-4">
<div>
<label className="block text-sm">Email</label>
<input type="email" className="w-full mt-1 border rounded-xl px-3 py-2" required />
</div>
<div>
<label className="block text-sm">No. HP</label>
<input className="w-full mt-1 border rounded-xl px-3 py-2" />
</div>
</div>
<div>
<label className="block text-sm">Catatan</label>
<textarea className="w-full mt-1 border rounded-xl px-3 py-2" rows={4} />
</div>
<button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold">Kirim</button>
</form>
</Container>
)
}