'use client'

import { useForm, ValidationError } from '@formspree/react'
import clsx from 'clsx';

export default function ContactForm() {
  const baseClass = 'max-w-[calc(640px+8vw)] mt-[3rem] mx-auto px-[4vw] w-full flex flex-col items-start gap-y-4'
  const [state, handleSubmit] = useForm("mpzolveb");

  if (state.succeeded) {
    return (
      <div className={baseClass}>
        <p className='text-2xl'>Thank you. I'll respond to your email as soon as possible.</p>
      </div>
    )
  }

  const inputClass = 'font-normal focus:border-slate-300 mt-[0.7rem] bg-white dark:bg-white-reversed border-[1px] border-slate-200 dark:border-neutral-600 border-solid leading-[1.15] rounded-md text-slate-800 dark:text-white text-xl h-[44px] outline-none px-6 dark:focus:border-neutral-500'
  const textAreaClass = 'h-full py-6 resize-y'

  return (
    <form onSubmit={handleSubmit} className={baseClass}>
      <label htmlFor='email' className='block text-xl text-black dark:text-white font-bold flex flex-col w-full'>
        Email Address:

        <input
          id="email"
          type="email"
          name="email"
          className={inputClass}
        />
        <ValidationError
          prefix="Email"
          field="email"
          errors={state.errors}
        />
      </label>

      <label htmlFor='message' className='block text-xl text-black dark:text-white font-bold flex flex-col w-full'>
        Message:

        <textarea
          id="message"
          name="message"
          className={clsx(textAreaClass, inputClass, 'min-h-[150px]')}
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
  );
}
