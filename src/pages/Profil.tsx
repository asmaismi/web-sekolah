import Container from '@/components/common/Container'
import Section from '@/components/common/Section'


export default function Profil() {
return (
<Container>
<Section title="Profil Sekolah" subtitle="Visi, misi, dan sejarah singkat.">
<div className="grid md:grid-cols-3 gap-6">
<div className="p-6 rounded-2xl border">
<h3 className="font-semibold">Visi</h3>
<p className="text-slate-600 mt-2">Menjadi sekolah unggul yang berkarakter, berprestasi, dan berbudaya.</p>
</div>
<div className="p-6 rounded-2xl border">
<h3 className="font-semibold">Misi</h3>
<ul className="list-disc pl-5 mt-2 text-slate-600 space-y-1">
<li>Mengembangkan potensi akademik dan non-akademik.</li>
<li>Membentuk karakter disiplin dan peduli.</li>
<li>Menciptakan lingkungan belajar nyaman.</li>
</ul>
</div>
<div className="p-6 rounded-2xl border">
<h3 className="font-semibold">Sejarah</h3>
<p className="text-slate-600 mt-2">Berdiri sejak 1998 dengan dukungan masyarakat setempat.</p>
</div>
</div>
</Section>
</Container>
)
}