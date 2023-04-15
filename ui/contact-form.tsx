'use client'

import { useForm } from '@formspree/react'
import * as Form from '@radix-ui/react-form'
import clsx from 'clsx'

type Props = { className?: string }
export default function ContactForm(props: Props) {
  const [state, handleSubmit] = useForm("mpzolveb")

  return (
    <Form.Root onSubmit={handleSubmit} className={clsx('grid grid-cols-canvas [&>*]:col-main gap-y-4', props.className)}>
      {state.succeeded && !state.submitting && (
        <div className='bg-[#f6f6f6] dark:bg-[#2f333c] text-neutral-800 px-4 sm:px-6 py-2 rounded-md text-sm flex flex-col sm:flex-row sm:gap-x-2'>
          <div className='font-extrabold'>Message sent succesfully.</div> I'll respond to your message as soon as possible.
        </div>
      )}

      <Form.Field name='email' className='flex flex-col gap-y-2'>
        <Form.Label className='block text-black dark:text-white font-bold'>
          Email Address:
        </Form.Label>
        <Form.Control
          required
          type='email'
          placeholder='What is your email?'
          className='font-normal focus:border-slate-300 bg-white dark:bg-white-reversed border-[1px] border-slate-200 dark:border-neutral-600 border-solid leading-[1.15] rounded-md text-slate-800 dark:text-white h-[44px] outline-none px-4 dark:focus:border-neutral-500'
        />
        <Form.Message className='text-sm text-black dark:text-white opacity-80' match='valueMissing'>
          Please enter your email
        </Form.Message>
        <Form.Message className='text-sm text-black dark:text-white opacity-80' match='typeMismatch'>
          Please provide a valid email
        </Form.Message>
      </Form.Field>

      <Form.Field name='subject' className='flex flex-col gap-y-2'>
        <Form.Label className='block text-black dark:text-white font-bold'>
          Subject:
        </Form.Label>
        <Form.Control
          required
          type='text'
          placeholder='What is your message about?'
          className='font-normal focus:border-slate-300 bg-white dark:bg-white-reversed border-[1px] border-slate-200 dark:border-neutral-600 border-solid leading-[1.15] rounded-md text-slate-800 dark:text-white h-[44px] outline-none px-4 dark:focus:border-neutral-500'
        />
        <Form.Message className='text-sm text-black dark:text-white opacity-80' match='valueMissing'>
          Please enter the subject of your message
        </Form.Message>
        <Form.Message className='text-sm text-black dark:text-white opacity-80' match='typeMismatch'>
          Please provide a valid subject
        </Form.Message>
      </Form.Field>

      <Form.Field name='message' className='flex flex-col gap-y-2'>
        <Form.Label className='block text-black dark:text-white font-bold'>
          Message:
        </Form.Label>
        <Form.Control asChild>
          <textarea
            className='w-full p-4 resize-y min-h-[150px] font-normal focus:border-slate-300 bg-white dark:bg-white-reversed border-[1px] border-slate-200 dark:border-neutral-600 border-solid leading-[1.15] rounded-md text-slate-800 dark:text-white h-44 outline-none dark:focus:border-neutral-500'
            rows={6}
            required
            minLength={50}
          />
        </Form.Control>
        <Form.Message className='text-sm text-black dark:text-white opacity-80' match='valueMissing'>
          Please enter a message
        </Form.Message>
        <Form.Message className='text-sm text-black dark:text-white opacity-80' match='typeMismatch'>
          Please provide a message with more than 50 characters
        </Form.Message>
      </Form.Field>

      <div>
        <Form.Submit
          disabled={state.submitting || state.succeeded}
          className={clsx(
            'disabled:opacity-60 disabled:cursor-not-allowed uppercase mt-2 items-center bg-white dark:bg-white-reversed border-[1px] border-slate-200 dark:border-neutral-600 hover:border-slate-300 dark:hover:border-neutral-500 border-solid rounded-md text-orange-400 text-[11px] font-extrabold h-[36px] justify-center tracking-[0.5px] outline-none px-[15px] uppercase',
            {
              'cursor-not-allowed': state.succeeded,
              'cursor-progress': state.submitting,
            },
          )}
        >
          Submit
        </Form.Submit>
      </div>
    </Form.Root>
  )
}
