'use client'

import { useForm, ValidationError } from '@formspree/react'
import Input from '@/ui/components/input'
import Textarea from '@/ui/components/textarea'

export default function ContactForm() {
  const baseClass = 'max-w-[calc(640px+8vw)] mt-[3rem] mx-auto px-4 sm:px-8  w-full flex flex-col items-start gap-y-4 text-sm'
  const [state, handleSubmit] = useForm("mpzolveb")

  if (state.succeeded) {
    return (
      <div className={baseClass}>
        <p>Thank you. I'll respond to your email as soon as possible.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={baseClass}>
      <label htmlFor='email' className='block text-black dark:text-white font-bold flex flex-col w-full'>
        Email Address:

        <Input
          id="email"
          type="email"
          name="email"
        />
        <ValidationError
          prefix="Email"
          field="email"
          errors={state.errors}
        />
      </label>

      <label htmlFor='message' className='block text-black dark:text-white font-bold flex flex-col w-full'>
        Message:

        <Textarea
          id="message"
          name="message"
          rows={6}
        />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
        />
      </label>

      <button
        aria-label='Submit contact form'
        type='submit'
        disabled={state.submitting}
        className='mt-6 items-center bg-white dark:bg-white-reversed border-[1px] border-slate-200 dark:border-neutral-600 hover:border-slate-300 dark:hover:border-neutral-500 border-solid rounded-md text-orange-400 text-[11px] font-extrabold h-[36px] justify-center tracking-[0.5px] outline-none px-[15px] uppercase'
      >
        SUBMIT
      </button>
    </form>
  )
}
