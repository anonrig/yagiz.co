import './globals.css'

import {Analytics} from "@vercel/analytics/react";
import clsx from "clsx";
import {Metadata} from "next";
import {Mulish} from "next/font/google";
import {PropsWithChildren} from "react";

import LayoutFooter from '@/ui/components/layout-footer';
import LayoutHeader from '@/ui/components/layout-header';

const description = "Here's a collection of posts about my thoughts, stories, ideas and experiences as a human, and an engineer working with different technologies.";
export const metadata: Metadata = {
  title: {
    default: 'Engineering with Yagiz',
    template: '%s - Yagiz Nizipli',
  },
  category: 'technology',
  description,
  metadataBase: new URL('https://www.yagiz.co'),
  openGraph: {
    title: 'Engineering with Yagiz',
    description,
    url: 'https://www.yagiz.co',
    siteName: 'Engineering with Yagiz',
    locale: 'en-US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: 'Engineering with Yagiz',
    description,
    card: 'summary_large_image',
    creator: '@yagiznizipli',
    creatorId: '1589638196',
  },
  icons: {
    icon: '/favicon.ico',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
}

const mulish = Mulish({
  display: 'swap',
  subsets: ['latin'],
  variable: '--font-mulish',
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif']
})

export default function RootLayout({ children }: PropsWithChildren<unknown>) {
  return (
    <html
      lang='en'
      className={clsx(
        'bg-white text-[62.5%] text-black dark:bg-white-reversed',
        mulish.className,
      )}>
      <body>
        <LayoutHeader />
        <main className='grow py-[6rem]'>
          {children}
        </main>
        <LayoutFooter />
        <Analytics />
      </body>
    </html>
  )
}
