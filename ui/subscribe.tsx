'use client'

import clsx from 'clsx'
import { ButtonHTMLAttributes, FormEvent, FormEventHandler, forwardRef, useCallback, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import Image from 'next/image'
import Input from '@/ui/components/input'
import { VariantProps, cva } from 'class-variance-authority'

const subscribeButtonVariants = cva(
  'text-orange-400',
  {
    variants: {
      variant: {
        bold: 'font-bold',
      },
      size: {
        'xl': 'text-xl',
        '2xl': 'text-2xl',
        '3xl': 'text-3xl'
      },
    },
    defaultVariants: {
      variant: 'bold',
      size: '2xl'
    }
  }
)

export interface SubscribeButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof subscribeButtonVariants> {
      label?: string
    }

const SubscribeButton = forwardRef<HTMLButtonElement, SubscribeButtonProps>(
  ({ className, variant, size, label }, ref) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    const { email, name } = event.target as any

    event.preventDefault()
    setLoading(true)
    try {
      const response = await fetch('/api/newsletter', {
        method: 'post',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          email: email.value,
          name: name.value,
        })
      })
      const json = await response.json()

      if (json.status === 200) {
        setMessage('')
        setOpen(false)
      } else {
        setMessage(json.message)
      }
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message)
      }
    } finally {
      setLoading(false)
    }
  }, [setLoading])

  return (
    <Dialog.Root open={open} onOpenChange={(o) => setOpen(o)}>
      <Dialog.Trigger asChild>
        <button
          ref={ref}
          className={clsx(subscribeButtonVariants({ variant, size, className }))}
          aria-label='Subscribe to the newsletter'
        >
          {label ?? 'Subscribe'}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="z-[30] fixed inset-0 backdrop-blur-sm bg-black/20" />
        <Dialog.Content className="z-[30] fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white dark:bg-black p-[25px] focus:outline-none">
          <div className='mt-[16px] mb-[32px] flex flex-col items-center'>
            <Image src='/family.png' width={60} height={60} className='rounded-full' alt='Yagiz Nizipli' />
            <Dialog.Title className="my-4 text-black dark:text-white tracking-4 text-5xl font-extrabold tracking-tight">
              Yagiz Nizipli
            </Dialog.Title>
          </div>
          <form onSubmit={handleSubmit}>
            <label htmlFor='name' className='block text-xl text-black dark:text-white font-bold flex flex-col w-full'>
              Name

              <Input
                id="name"
                type="text"
                name="name"
                required
              />
            </label>

            <label htmlFor='email' className='block text-xl text-black dark:text-white font-bold flex flex-col w-full mt-8'>
              Email

              <Input
                id="email"
                type="email"
                name="email"
                required
              />
            </label>

            <button
              type='submit'
              disabled={loading}
              className="mt-16 mb-10 w-full bg-orange-400 text-white dark:text-white-reversed h-[42px] px-[1.8rem] rounded-lg font-bold"
            >
              Subscribe
            </button>

            {message.length > 0 && (
              <div className='text-center text-lg'>
                Message: {message}
              </div>
            )}
          </form>

          <Dialog.Close asChild>
            <button
              className="absolute top-[10px] right-[10px] inline-flex h-[44px] w-[44px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
              aria-label="Close"
            >
              <XIcon size={24} className='text-neutral-300 m-4' />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
})

export default SubscribeButton
