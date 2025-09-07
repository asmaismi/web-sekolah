import React from 'react'
import clsx from 'clsx'

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string
}

export default function Textarea({ className='', error, ...rest }: Props) {
  return (
    <div>
      <textarea
        className={clsx('w-full rounded-xl border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
          error ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-slate-300',
          className
        )}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
