import { useUI } from '@/store/ui'


export default function ToastStack() {
const { toasts, remove } = useUI()
return (
<div className="fixed bottom-4 right-4 space-y-2 z-[100]">
{toasts.map((t) => (
<div key={t.id} className="bg-slate-900 text-white text-sm px-4 py-2 rounded-xl shadow">
<div className="flex items-center gap-3">
<span>{t.message}</span>
<button onClick={() => remove(t.id)} className="opacity-70 hover:opacity-100">×</button>
</div>
</div>
))}
</div>
)
}