import { $isSubscribeVisible } from '@/lib/stores'
import { type VariantProps, cva } from 'class-variance-authority'
import clsx from 'clsx'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

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
    return (
      <button
        type="button"
        ref={ref}
        className={clsx(subscribeButtonVariants({ variant, className }))}
        onClick={() => $isSubscribeVisible.set(true)}
      >
        {label ?? 'Subscribe'}
        <span className="sr-only">to the newsletter</span>
      </button>
    )
  },
)

SubscribeButton.displayName = 'SubscribeButton'

export default SubscribeButton
