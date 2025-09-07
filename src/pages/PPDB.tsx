import Section from '@/components/common/Section'
import Label from '@/components/ui/Label'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

import type { FormEvent } from 'react';

export default function PPDB() {
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    alert('Form dummy terkirim (demo)')
  }

  return (
    <Section title="Pendaftaran Peserta Didik Baru (PPDB)" subtitle="Silakan isi data di bawah ini untuk mendaftar.">
      <form onSubmit={onSubmit} className="max-w-xl space-y-4 border rounded-2xl p-6 bg-white">
        <div>
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input id="nama" required placeholder="Nama lengkap" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nisn">NISN</Label>
            <Input id="nisn" placeholder="NISN" />
          </div>
          <div>
            <Label htmlFor="telepon">No. HP</Label>
            <Input id="telepon" placeholder="08xxxxxxxxxx" />
          </div>
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="email@contoh.com" />
        </div>
        <div>
          <Label htmlFor="alamat">Alamat</Label>
          <Textarea id="alamat" rows={3} placeholder="Alamat lengkap" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="jk">Jenis Kelamin</Label>
            <select id="jk" className="w-full rounded-xl border border-slate-300 px-3 py-2">
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div>
            <Label htmlFor="program">Program</Label>
            <select id="program" className="w-full rounded-xl border border-slate-300 px-3 py-2">
              <option>IPA</option>
              <option>IPS</option>
              <option>Bahasa</option>
            </select>
          </div>
        </div>
        <div className="pt-2">
          <Button type="submit" size="lg">Kirim Pendaftaran</Button>
        </div>
      </form>
    </Section>
  )
}
