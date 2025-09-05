import React from 'react'
export default function Section({ title, subtitle, children }: { title: string; subtitle?: string; children?: React.ReactNode }) {
return (
<section className="py-12">
<h2 className="text-2xl font-bold">{title}</h2>
{subtitle && <p className="text-slate-600 mt-2">{subtitle}</p>}
<div className="mt-6">{children}</div>
</section>
)
}