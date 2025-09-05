import { create } from 'zustand'


type Toast = { id: number; message: string }
interface UIState {
toasts: Toast[]
push: (message: string) => void
remove: (id: number) => void
}
let seq = 0
export const useUI = create<UIState>((set) => ({
toasts: [],
push(message) {
const id = ++seq
set((s) => ({ toasts: [...s.toasts, { id, message }] }))
// auto-hide
setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3000)
},
remove(id) { set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })) },
}))