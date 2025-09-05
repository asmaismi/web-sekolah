import Container from '@/components/common/Container'
import Section from '@/components/common/Section'


const programs = [
{ name: 'IPA', desc: 'Pendalaman sains, laboratorium lengkap.' },
{ name: 'IPS', desc: 'Ekonomi, sosiologi, geografi terapan.' },
{ name: 'Bahasa', desc: 'Bahasa Indonesia, Inggris, dan Jepang.' },
]


export default function Program() {
return (
<Container>
<Section title="Program & Kurikulum" subtitle="Jalur peminatan dan muatan lokal.">
<div className="grid md:grid-cols-3 gap-6">
{programs.map(p => (
<div key={p.name} className="p-6 rounded-2xl border">
<h3 className="font-semibold">{p.name}</h3>
<p className="text-slate-600 mt-2">{p.desc}</p>
</div>
))}
</div>
</Section>
</Container>
)
}