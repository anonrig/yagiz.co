import clsx from "clsx";
import { Rss, Twitter } from 'lucide-react'
import Link from 'next/link'
import type { Route } from 'next';

const twitterUrl = 'https://twitter.com/yagiznizipli'
const rssUrl = 'https://feedly.com/i/subscription/feed%2Fhttps%3A%2F%2Fwww.yagiz.co%2Frss%2F'
const items: { title: string; href: Route}[] = [
  { title: 'Press', href: '/press' },
  { title: 'Contact', href: '/contact' },
]

export default function LayoutFooter() {
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
          <Twitter size={18} className='rounded-sm bg-[#999] hover:bg-[#CCC]' fill='white'/>
        </a>

        <a
          href={rssUrl}
          className='mx-[4px] p-[3px] leading-[0] text-white dark:text-white-reversed'
          rel='noopener noreferrer'
          target='_blank'
          aria-label='RSS'
        >
          <Rss size={18} className='rounded-sm bg-[#999] p-0.5 hover:bg-[#CCC] dark:bg-neutral-400 hover:dark:bg-neutral-500'/>
        </a>
      </div>
      <nav className='mt-2 flex flex-wrap items-center justify-center'>
        {items.map((item, index) => (
          <Link
            href={item.href}
            key={item.href}
            className={clsx(
              'flex items-center text-lg font-normal text-slate-500 dark:text-neutral-400',
              index !== 0 && "before:block before:px-[0.7rem] before:font-serif before:leading-[1] before:content-['\\02022']",
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </footer>
  )
}
