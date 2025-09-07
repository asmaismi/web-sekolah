import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Section from "../../components/common/Section";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../store/auth";

export default function AdminLogin() {
  const nav = useNavigate();
  const login = useAuth((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) nav("/admin");
    else setError(res.error || "Login gagal");
  }

  return (
    <Section
      title="Masuk Admin"
      subtitle="Gunakan akun admin untuk mengelola konten."
    >
      <form onSubmit={onSubmit} className="max-w-sm space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-slate-700 mb-1"
            htmlFor="email"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium text-slate-700 mb-1"
            htmlFor="password"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-xs text-rose-600">{error}</p>}
        <Button
          type="submit"
          /* kalau Button kamu tidak punya prop 'loading', ganti ke disabled={loading} */ loading={
            loading
          }
          className="mt-2"
        >
          Masuk
        </Button>
      </form>
    </Section>
  );
}
