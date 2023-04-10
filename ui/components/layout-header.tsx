import Link from "next/link";
import { MobileNavigationToggle, MobileNavigationContextProvider } from "../mobile-navigation-toggle";
import SubscribeButton from "../subscribe";

export type HeaderItem = {
  title: string
  href: string
}

const items: HeaderItem[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Press', href: '/press' },
  { title: 'Contact', href: '/contact' },
]

export default function LayoutHeader() {
  return (
    <MobileNavigationContextProvider>
      <header className='flex h-navigation-bar items-center px-[4vw] mx-auto w-full max-w-[calc(1130px+8vw)]'>
        <div className='flex flex-[2] items-center'>
          <Link href='/' className='text-[1.8rem] font-extrabold text-slate-400 dark:text-neutral-200' aria-label='Navigate to the homepage'>
            Yagiz Nizipli
          </Link>
        </div>

        <nav className='hidden items-center md:flex'>
          {items.map(item => (
            <Link
              href={item.href}
              key={item.href}
              className='mx-6 font-bold text-slate-800 dark:text-zinc-200 hover:text-slate-600'
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <div className='hidden items-center justify-end md:flex md:flex-[2]'>
          <SubscribeButton />
        </div>

        <div className='pointer h-30 w-30 md:hidden items-center flex'>
          <MobileNavigationToggle items={items} />
        </div>
      </header>
    </MobileNavigationContextProvider>
  )
}
