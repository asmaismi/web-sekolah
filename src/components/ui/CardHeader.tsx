import React from 'react'
export default function CardHeader({ className='', ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={'mb-4 '+className} {...rest} />
}
