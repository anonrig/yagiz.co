import clsx from 'clsx'
import { Rss, Twitter } from 'lucide-react'
import Link from 'next/link'

import { rssUrl, twitterUrl } from '@/app/content'
import SubscribeButton from '@/components/subscribe'

import { MobileNavigationContextProvider, MobileNavigationToggle } from './mobile-navigation-toggle'

export type Item = {
  title: string
  href: string
}

const headerItems: Item[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Press', href: '/press' },
  { title: 'Contact', href: '/contact' },
]
const footerItems: Item[] = [
  { title: 'Press', href: '/press' },
  { title: 'Contact', href: '/contact' },
]

export function Header() {
  return (
    <MobileNavigationContextProvider>
      <header className='flex h-navigation-bar items-center px-[4vw] mx-auto w-full max-w-[calc(1130px+8vw)]'>
        <div className='flex flex-[2] items-center'>
          <Link
            href='/'
            className='text-lg font-extrabold text-slate-400 dark:text-neutral-200'
            aria-label='Navigate to the homepage'
          >
            Yagiz Nizipli
          </Link>
        </div>

        <nav className='hidden items-center md:flex'>
          {headerItems.map((item) => (
            <Link
              href={item.href}
              key={item.href}
              className='mx-4 font-bold text-slate-800 dark:text-zinc-200 hover:text-slate-600 text-sm'
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className='hidden items-center justify-end md:flex md:flex-[2]'>
          <SubscribeButton />
        </div>

        <div className='pointer h-30 w-30 md:hidden items-center flex text-black dark:text-neutral-300'>
          <MobileNavigationToggle items={headerItems} />
        </div>
      </header>
    </MobileNavigationContextProvider>
  )
}

export function Footer() {
  return (
    <footer className='flex flex-col items-center pb-20 pt-12 mx-auto w-full max-w-6xl'>
      <div className='mb-8 flex'>
        <a
          href={twitterUrl}
          className='mx-[4px] p-[3px] leading-[0] text-[#999] hover:text-[#CCC] dark:text-neutral-400'
          rel='noopener noreferrer'
          target='_blank'
          aria-label='Twitter'
        >
          <Twitter size={18} className='rounded-sm bg-[#999] hover:bg-[#CCC]' fill='white' />
        </a>

        <a
          href={rssUrl}
          className='mx-[4px] p-[3px] leading-[0] text-white dark:text-white-reversed'
          rel='noopener noreferrer'
          target='_blank'
          aria-label='RSS'
        >
          <Rss
            size={18}
            className='rounded-sm bg-[#999] p-0.5 hover:bg-[#CCC] dark:bg-neutral-400 hover:dark:bg-neutral-500'
          />
        </a>
      </div>
      <nav className='flex flex-wrap items-center justify-center'>
        {footerItems.map((item, index) => (
          <Link
            href={item.href}
            key={item.href}
            className={clsx(
              'flex items-center text-xs font-normal text-slate-500 dark:text-neutral-400',
              index !== 0 &&
                "before:block before:px-[0.7rem] before:font-serif before:leading-[1] before:content-['\\02022']",
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </footer>
  )
}
