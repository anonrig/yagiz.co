'use client'

import Link from 'next/link'
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useState } from "react"
import type { Item } from '@/ui/layout'
import { MenuIcon, XIcon } from 'lucide-react'
import clsx from "clsx"
import SubscribeButton from './subscribe'
import Container from '@/ui/components/container'

const MobileNavigationContext = createContext<[
  boolean,
  Dispatch<SetStateAction<boolean>>
] | undefined>(undefined)

export function MobileNavigationContextProvider({ children }: PropsWithChildren<unknown>) {
  const [open, setOpen] = useState<boolean>(false)
  return (
    <MobileNavigationContext.Provider value={[open, setOpen]}>
      {children}
    </MobileNavigationContext.Provider>
  )
}

export function useMobileNavigationToggle() {
  const context = useContext(MobileNavigationContext)
  if (context === undefined) {
    throw new Error('useMobileNavigationToggle must be used within a MobileNavigationContextProvider')
  }
  return context
}

export function MobileNavigationToggle({ items }: { items: Item[] }) {
  const [open, setOpen] = useMobileNavigationToggle()

  return (
    <>
      <button onClick={() => setOpen(!open)} aria-label='Toggle mobile navigation menu visibility'>
        {open ? <XIcon size={20} /> : <MenuIcon size={20} />}
      </button>

      <div className={clsx(
        'bg-white dark:bg-white-reversed h-mobile-overlay left-0 pt-12 fixed top-navigation-bar w-full z-navigation-bar z-[20] overflow-y-auto',
        { hidden: !open }
      )}>
        <Container>
          <nav className='flex flex-col gap-6'>
            {items.map(item => (
              <Link
                href={item.href}
                key={item.href}
                className='text-lg text-right font-bold'
                onClick={() => setOpen(false)}
              >
                {item.title}
              </Link>
            ))}

            <SubscribeButton className='text-right text-lg' />
          </nav>
        </Container>
      </div>
    </>
  )
}
