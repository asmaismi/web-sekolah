import React from 'react';

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string };

export default function ATextarea({ error, className = '', ...rest }: Props) {
  return (
    <div>
      <textarea
        className={
          'w-full rounded-2xl border px-4 py-2 text-sm ' +
          'border-slate-300 bg-white placeholder:text-slate-400 ' +
          'focus:outline-none focus:ring-2 focus:ring-violet-500 ' +
          (className || '')
        }
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-rose-600">{error}</p>}
    </div>
  );
}
