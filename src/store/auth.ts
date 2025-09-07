import { create } from "zustand";
import { supabase } from "../lib/supabase";

type AuthUser = { id: string; email: string | null };
export type AuthResult = { ok: boolean; error?: string };

type AuthState = {
  user: AuthUser | null;
  status: "idle" | "ready";
  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  status: "idle",

  async init() {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        set({
          user: { id: session.user.id, email: session.user.email },
          status: "ready",
        });
      } else {
        set({ user: null, status: "ready" });
      }
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          user: session?.user
            ? { id: session.user.id, email: session.user.email }
            : null,
        });
      });
    } catch {
      set({ user: null, status: "ready" });
    }
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { ok: false, error: error.message };
    const u = data.user;
    if (!u) return { ok: false, error: "User tidak ditemukan" };
    set({ user: { id: u.id, email: u.email } });
    return { ok: true };
  },

  async logout() {
    try {
      await supabase.auth.signOut();
    } finally {
      set({ user: null });
    }
  },
}));
