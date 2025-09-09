import { supabase } from "@/lib/supabase";
import useUI from "@/store/ui";
import { Mail, Send, User } from "lucide-react";
import { FormEvent, useState } from "react";

export default function TeacherLoginCard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const toast = useUI((s) => s.add);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { data: { name } },
      });
      if (error) throw error;

      toast("Link konfirmasi dikirim.");
      setMsg("Cek email Anda untuk konfirmasi.");
    } catch (e: any) {
      setErr(e?.message || "Gagal mengirim link");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-1 text-sm font-semibold">Login Guru</div>
      <p className="text-xs text-slate-500 mb-3">
        Masukkan nama & email, kami kirim link konfirmasi ke email Anda.
      </p>

      <form onSubmit={onSubmit} className="grid gap-3">
        <label className="grid gap-1">
          <span className="text-xs font-medium text-slate-600">Nama</span>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border px-9 py-2.5"
              placeholder="Nama lengkap"
            />
          </div>
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-medium text-slate-600">Email</span>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-9 py-2.5"
              placeholder="email@sekolah.sch.id"
            />
          </div>
        </label>

        {msg && <div className="text-xs text-emerald-600">{msg}</div>}
        {err && <div className="text-xs text-rose-600">{err}</div>}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-black px-4 text-white hover:opacity-90 disabled:opacity-60"
        >
          <Send size={16} />
          {loading ? "Mengirim..." : "Kirim Link"}
        </button>
      </form>
    </div>
  );
}
