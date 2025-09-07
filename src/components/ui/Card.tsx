import React from 'react'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  padded?: boolean
}

export default function Card({ className='', padded=true, ...rest }: Props) {
  return <div className={'card ' + (padded ? 'p-6 ' : '') + className} {...rest} />
}
