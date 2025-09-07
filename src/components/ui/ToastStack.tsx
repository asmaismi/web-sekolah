import useUI from "../../store/ui"; // atau: import { useUI } from '../../store/ui'

export default function ToastStack() {
  const toasts = useUI((s) => s.toasts);
  const remove = useUI((s) => s.remove);

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((t) => (
        <div key={t.id} className="px-4 py-2 rounded-xl border bg-white shadow">
          <div className="flex items-center gap-3">
            <span className="text-sm">{t.message}</span>
            <button
              className="text-slate-500 text-xs"
              onClick={() => remove(t.id)}
            >
              Tutup
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
