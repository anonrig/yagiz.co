import './globals.css'

import clsx from 'clsx'
import { Metadata, Viewport } from 'next'
import { Mulish } from 'next/font/google'
import { PropsWithChildren } from 'react'

import { websiteDomain } from '@/app/content'
import { Footer, Header } from '@/components/layout'

import Providers from './providers'

const description =
  "Here's a collection of posts about my thoughts, stories, ideas and experiences as a human, and an engineer working with different technologies."
export const metadata: Metadata = {
  title: {
    default: 'Engineering with Yagiz',
    template: '%s - Engineering with Yagiz',
  },
  description,
  category: 'technology',
  creator: 'Yagiz Nizipli',
  publisher: 'Yagiz Nizipli',
  metadataBase: new URL(websiteDomain),
  openGraph: {
    title: 'Engineering with Yagiz',
    description,
    siteName: 'Engineering with Yagiz',
    locale: 'en-US',
    type: 'website',
    url: websiteDomain,
    images: [
      {
        url: new URL('/opengraph-image.png', websiteDomain).href,
        width: 1200,
        height: 600,
        alt: 'Engineering with Yagiz',
        type: 'image/png',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  twitter: {
    title: 'Engineering with Yagiz',
    description,
    card: 'summary_large_image',
    siteId: '1589638196',
    creator: '@yagiznizipli',
    creatorId: '1589638196',
    images: [
      {
        url: new URL('/opengraph-image.png', websiteDomain).href,
        width: 1200,
        height: 600,
        alt: 'Engineering with Yagiz',
        type: 'image/png',
      },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

const mulish = Mulish({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-mulish',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
})

export default function RootLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <html
      lang="en"
      className={clsx('bg-white text-black dark:bg-white-reversed', mulish.className)}
      suppressHydrationWarning
    >
      <body>
        <Providers>
          <Header />
          <main className="grow py-14">{children}</main>
        </Providers>
        <Footer />
      </body>
    </html>
  )
}
