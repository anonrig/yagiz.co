'use client'

import { VariantProps, cva } from 'class-variance-authority'
import clsx from 'clsx'
import { ButtonHTMLAttributes, forwardRef } from 'react'

import { useSubscribe } from '@/app/providers'

const subscribeButtonVariants = cva('text-orange-400', {
  variants: {
    variant: {
      bold: 'font-bold',
    },
  },
  defaultVariants: {
    variant: 'bold',
  },
})

export interface SubscribeButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof subscribeButtonVariants> {
  label?: string
}

const SubscribeButton = forwardRef<HTMLButtonElement, SubscribeButtonProps>(
  ({ className, variant, label }, ref) => {
    const { setVisible } = useSubscribe()

    return (
      <button
        type="button"
        ref={ref}
        className={clsx(subscribeButtonVariants({ variant, className }))}
        aria-label="Subscribe to the newsletter"
        onClick={() => setVisible(true)}
      >
        {label ?? 'Subscribe'}
      </button>
    )
  },
)

SubscribeButton.displayName = 'SubscribeButton'

export default SubscribeButton
