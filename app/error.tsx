'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

import Container from '@/components/ui/container'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorHandler({ error, reset }: Props) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <Container>
      <p>Oh no, something went wrong... maybe refresh?</p>
      <button
        onClick={() => reset()}
        type="button"
        className="uppercase mt-2 items-center bg-white dark:bg-white-reversed border-[1px] border-slate-200 dark:border-neutral-600 hover:border-slate-300 dark:hover:border-neutral-500 border-solid rounded-md text-orange-400 text-[11px] font-extrabold h-[36px] justify-center tracking-[0.5px] outline-none px-[15px]"
      >
        Try again
      </button>
    </Container>
  )
}
