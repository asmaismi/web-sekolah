export default function Footer() {
return (
<footer className="border-t mt-16">
<div className="mx-auto max-w-7xl px-4 py-8 text-sm text-slate-600 flex justify-between">
<span>© {new Date().getFullYear()} Nama Sekolah</span>
<span>Built with React + Tailwind</span>
</div>
</footer>
)
}