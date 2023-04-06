'use client'

import clsx from 'clsx';
import { Blog } from 'contentlayer/generated'
import { useMemo } from 'react';
import { useWindowScroll } from 'react-use';

export default function BlogStickyHeader({ blog }: { blog: Blog }) {
  const { y: scrollY } = useWindowScroll()
  const scrollPercentage = useMemo(() => {
    if (scrollY === 0) return 100;
    const windowHeight = document.documentElement.scrollHeight- document.documentElement.clientHeight
    return 100 - Math.floor((scrollY / windowHeight) * 100)
  }, [scrollY])

  return (
    <header className={clsx(
      'top-0 inset-x-0 items-center backdrop-blur-sm bg-[hsla(0,0%,100%,.8)] flex h-[50px] justify-between px-8 fixed z-[90] duration-300 transition-transform ease-in-out',
      scrollPercentage <= 99 ? 'translate-y-0' : 'translate-y-[-52px]',
    )}>
      <div className='text-slate-800 grow leading-[1.3] mr-4 overflow-hidden overflow-ellipsis whitespace-nowrap text-xl font-bold'>
        {blog.title}
      </div>

      <div className='bg-[#e6e6e6] bottom-[-2px] h-[2px] left-0 absolute w-full'>
        <div
          className='bg-orange-400 h-full duration-200 transition-transform'
          style={{ transform: `translate3d(-${scrollPercentage}%, 0px, 0px)` }}
        ></div>
      </div>
    </header>
  )
}
