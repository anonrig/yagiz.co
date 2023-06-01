import { VariantProps, cva } from 'class-variance-authority'
import clsx from 'clsx'
import Image from 'next/image'

const figureVariants = cva('mt-6', {
  variants: {
    size: {
      wide: 'col-wide',
      main: 'col-main',
    },
  },
  defaultVariants: {
    size: 'wide',
  },
})

interface Props extends VariantProps<typeof figureVariants> {
  className?: string
  caption?: string
  src: string
  alt: string
  blurDataURL?: string
}

export default function Figure({ size, className, ...props }: Props) {
  return (
    <figure className={clsx(figureVariants({ size, className }))}>
      <div className='relative bg-gray-100 before:block before:pb-[50%] before:content-[""]'>
        <Image
          alt={props.alt}
          src={props.src}
          fill
          className='object-cover duration-300 ease-in-out'
          blurDataURL={props.blurDataURL}
          placeholder={props.blurDataURL === undefined ? 'blur' : undefined}
        />
      </div>
      {props.caption !== undefined && (
        <figcaption className='mt-4 text-sm text-neutral-400'>{props.caption}</figcaption>
      )}
    </figure>
  )
}
