'use client'

import Sentry from '@sentry/nextjs'
import clsx from 'clsx'
import NextError from 'next/error'
import { Mulish } from 'next/font/google'
import React from 'react'

const mulish = Mulish({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-mulish',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
})

type Props = {
  error: Error & { digest?: string }
}

export default function GlobalError(props: Props) {
  React.useEffect(() => {
    Sentry.captureException(props.error)
  }, [props.error])

  return (
    <html lang="en">
      <body className={clsx('bg-white text-black dark:bg-white-reversed', mulish.className)}>
        <NextError statusCode={200} />
      </body>
    </html>
  )
}
