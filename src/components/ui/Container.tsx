import { type VariantProps, cva } from 'class-variance-authority'
import clsx from 'clsx'
import type { ElementType, PropsWithChildren } from 'react'

const containerVariants = cva('mx-auto px-[4vw] w-full', {
  variants: {
    size: {
      wide: 'max-w-[calc(1130px+8vw)]',
      tight: 'max-w-[calc(750px+8vw)]',
    },
  },
  defaultVariants: {
    size: 'wide',
  },
})

interface Props extends VariantProps<typeof containerVariants> {
  className?: string
  as?: ElementType
}

export default function Container({ size, className, children, as }: PropsWithChildren<Props>) {
  const Component = as ?? 'div'
  return <Component className={clsx(containerVariants({ size, className }))}>{children}</Component>
}
