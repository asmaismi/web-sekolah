import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  block?: boolean;
};

const base =
  'inline-flex items-center justify-center rounded-2xl font-medium transition shadow-sm ' +
  'focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

const sizes = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-3',
};

const variants = {
  primary:  'bg-violet-600 text-white hover:bg-violet-700 focus:ring-violet-600',
  secondary:'bg-slate-900 text-white hover:bg-black focus:ring-slate-900',
  outline:  'border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 focus:ring-slate-400',
  subtle:   'bg-slate-100 text-slate-800 hover:bg-slate-200 focus:ring-slate-300',
  danger:   'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600',
};

export default function AButton({
  variant = 'primary',
  size = 'md',
  loading,
  block,
  className = '',
  children,
  ...rest
}: Props) {
  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${block ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {loading ? 'Menyimpan…' : children}
    </button>
  );
}
