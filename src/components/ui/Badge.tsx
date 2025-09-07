import React from 'react'
import clsx from 'clsx'

type Variant = 'default' | 'success' | 'warning' | 'info'

export default function Badge({ className='', variant='default', children }: { className?: string; variant?: Variant; children: React.ReactNode }) {
  const styles: Record<Variant,string> = {
    default: 'bg-slate-100 text-slate-800',
    success: 'bg-emerald-100 text-emerald-800',
    warning: 'bg-amber-100 text-amber-800',
    info: 'bg-sky-100 text-sky-800',
  }
  return <span className={clsx('inline-flex items-center px-2 py-1 text-xs font-medium rounded-lg', styles[variant], className)}>{children}</span>
}
