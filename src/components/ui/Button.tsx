import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from './utils'


const button = cva(
'inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500',
{ variants: { variant: {
primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
outline: 'border border-slate-300 hover:bg-slate-50',
}}, defaultVariants: { variant: 'primary' } }
)


export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof button>
export function Button({ className, variant, ...props }: ButtonProps) {
return <button className={cn(button({ variant }), className)} {...props} />
}