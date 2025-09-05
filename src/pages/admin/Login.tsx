import { useState } from 'react'
import { useAuth } from '@/store/auth'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const { login, loading } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('asmaismi557@gmail.com')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await login(email, password)
    if (res.ok) nav('/admin'); else setErr(res.error || 'Login gagal')
  }

  return (
    <div className="min-h-dvh grid place-items-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm border rounded-2xl p-6 bg-white">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <label className="block text-sm">Email</label>
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full mt-1 mb-3 border rounded-xl px-3 py-2" required />
        <label className="block text-sm">Password</label>
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full mt-1 mb-4 border rounded-xl px-3 py-2" required />
        {err && <div className="text-red-600 text-sm mb-3">{err}</div>}
        <button disabled={loading} className="w-full bg-indigo-600 text-white rounded-xl py-2 font-semibold">
          {loading ? 'Memproses…' : 'Masuk'}
        </button>
      </form>
    </div>
  )
}
