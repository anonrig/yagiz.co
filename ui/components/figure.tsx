import Image from 'next/image'

import { cva, VariantProps } from 'class-variance-authority'
import clsx from 'clsx'

const figureVariants = cva(
  'mt-[4.5rem]',
  {
    variants: {
      size: {
        wide: 'col-wide',
        main: 'col-main',
      },
    },
    defaultVariants: {
      size: 'wide'
    }
  }
)

interface Props extends VariantProps<typeof figureVariants> {
  className?: string
  caption?: string
  src: string
  alt: string
}

export default function Figure({ size, className, ...props }: Props) {
  return (
    <figure className={clsx(figureVariants({ size, className }))}>
      <div className='relative z-10 bg-gray-100 before:block before:pb-[50%] before:content-[""]'>
        <Image
          alt={props.alt}
          src={props.src}
          fill
          sizes='920px'
          className='object-cover duration-300 ease-in-out'
          priority
        />
      </div>
      {props.caption !== undefined && (
        <figcaption className='mt-6 text-xl text-neutral-400'>
          {props.caption}
        </figcaption>
      )}
    </figure>
  )
}
