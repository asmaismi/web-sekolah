import React from 'react'
export default function CardFooter({ className='', ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={'mt-4 '+className} {...rest} />
}
