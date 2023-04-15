'use client'

import * as Dialog from '@radix-ui/react-dialog'
import * as Form from '@radix-ui/react-form'
import { cva, VariantProps } from 'class-variance-authority'
import clsx from 'clsx'
import { XIcon } from 'lucide-react'
import Image from 'next/image'
import { ButtonHTMLAttributes, FormEvent, forwardRef, useCallback, useState } from 'react'

const subscribeButtonVariants = cva(
  'text-orange-400',
  {
    variants: {
      variant: {
        bold: 'font-bold',
      },
    },
    defaultVariants: {
      variant: 'bold',
    }
  }
)

export interface SubscribeButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof subscribeButtonVariants> {
      label?: string
    }

const SubscribeButton = forwardRef<HTMLButtonElement, SubscribeButtonProps>(
  ({ className, variant, label }, ref) => {
  const [open, setOpen] = useState(true)
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
          className={clsx(subscribeButtonVariants({ variant, className }))}
          aria-label='Subscribe to the newsletter'
        >
          {label ?? 'Subscribe'}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='z-[30] fixed inset-0 backdrop-blur-sm bg-black/20' />
        <Dialog.Content className='z-[30] fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-md bg-white dark:bg-black p-4 focus:outline-none overflow-y-scroll'>
          <div className='mt-[16px] mb-[32px] flex flex-col items-center'>
            <Image src='/family.png' width={60} height={60} className='rounded-full' alt='Yagiz Nizipli' />
            <Dialog.Title className='my-4 text-black dark:text-white tracking-4 text-3xl font-extrabold tracking-tight'>
              Yagiz Nizipli
            </Dialog.Title>
          </div>
          <Form.Root onSubmit={handleSubmit} className='flex flex-col gap-y-4'>
            <Form.Field name='email' className='flex flex-col gap-y-2'>
              <Form.Label
                className='block text-sm text-black dark:text-white font-bold flex flex-col w-full'
              >Name</Form.Label>
              <Form.Control
                type='text'
                required
                className='font-normal focus:border-slate-300 bg-white dark:bg-white-reversed border-[1px] border-slate-200 dark:border-neutral-600 border-solid leading-[1.15] rounded-md text-slate-800 dark:text-white h-[44px] outline-none px-4 dark:focus:border-neutral-500'
              />
              <Form.Message className='text-sm text-black dark:text-white opacity-80' match='valueMissing'>
                Please enter your name
              </Form.Message>
              <Form.Message className='text-sm text-black dark:text-white opacity-80' match='typeMismatch'>
                Please provide a valid name
              </Form.Message>
            </Form.Field>

            <Form.Field name='email' className='flex flex-col gap-y-2'>
              <Form.Label
                className='block text-sm text-black dark:text-white font-bold flex flex-col w-full'
              >Email</Form.Label>
              <Form.Control
                type='email'
                required
                className='font-normal focus:border-slate-300 bg-white dark:bg-white-reversed border-[1px] border-slate-200 dark:border-neutral-600 border-solid leading-[1.15] rounded-md text-slate-800 dark:text-white h-[44px] outline-none px-4 dark:focus:border-neutral-500'
              />
              <Form.Message className='text-sm text-black dark:text-white opacity-80' match='valueMissing'>
                Please enter your email
              </Form.Message>
              <Form.Message className='text-sm text-black dark:text-white opacity-80' match='typeMismatch'>
                Please provide a valid email
              </Form.Message>
            </Form.Field>

            <Form.Submit
              disabled={loading}
              className='disabled:opacity-60 mt-4 mb-4 w-full bg-orange-400 text-white dark:text-white-reversed h-[42px] px-[1.8rem] rounded-lg font-bold'
            >
              Subscribe
            </Form.Submit>

            {message.length > 0 && (
              <div className='text-center'>
                Message: {message}
              </div>
            )}
          </Form.Root>

          <Dialog.Close
            className='absolute top-4 right-4 inline-flex appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none'
            arial-label='Close'
          >
            <XIcon size={24} className='text-neutral-300 m-2' />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
})

SubscribeButton.displayName = 'SubscribeButton'

export default SubscribeButton
