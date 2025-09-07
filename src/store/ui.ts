import { create } from "zustand";

type Toast = { id: string; message: string };

type UIState = {
  toasts: Toast[];
  add: (message: string) => string;
  remove: (id: string) => void;
};

const useUI = create<UIState>((set, get) => ({
  toasts: [],
  add(message) {
    const id = Math.random().toString(36).slice(2);
    set({ toasts: [...get().toasts, { id, message }] });
    return id;
  },
  remove(id) {
    set({ toasts: get().toasts.filter((t) => t.id !== id) });
  },
}));

export default useUI;
export { useUI };
