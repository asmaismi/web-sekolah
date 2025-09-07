import React from 'react'
export default function CardBody({ className='', ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...rest} />
}
