'use client'

import clsx from 'clsx';
import { Blog } from 'contentlayer/generated'
import { useMemo, useEffect, useState } from 'react';
import debounce from 'lodash.debounce'
import SubscribeButton from '../subscribe';

function useWindowScrollPercentage() {
  const isBrowser = typeof window !== 'undefined'
  const [state, setState] = useState({
    x: isBrowser ? window.pageXOffset : 0,
    y: isBrowser ? window.pageYOffset : 0,
  })

  useEffect(() => {
    const handler = debounce(() => {
      setState((state) => {
        const { pageXOffset, pageYOffset } = window;
        // Check state for change, return same state if no change happened to prevent rerender
        //(see useState/setState documentation). useState/setState is used internally in useRafState/setState.
        return state.x !== pageXOffset || state.y !== pageYOffset
          ? {
              x: pageXOffset,
              y: pageYOffset,
            }
          : state;
      });
    }, 100);

    //We have to update window scroll at mount, before subscription.
    //Window scroll may be changed between render and effect handler.
    handler();

    document.addEventListener('scroll', handler, {
      capture: false,
      passive: true,
    })

    return () => document.removeEventListener('scroll', handler)
  }, []);

  return useMemo(() => {
    if (state.y === 0) return 100
    const windowHeight = document.documentElement.scrollHeight- document.documentElement.clientHeight
    return 100 - Math.floor((scrollY / windowHeight) * 100)
  }, [state.y])
}

export default function BlogStickyHeader({ blog }: { blog: Blog }) {
  const scrollPercentage = useWindowScrollPercentage()

  return (
    <header
      className={clsx(
        'top-0 inset-x-0 items-center backdrop-blur-sm bg-[hsla(0,0%,100%,.8)] dark:bg-white-reversed/50 flex h-[50px] justify-between px-8 fixed z-[90] duration-300 transition-transform ease-in-out',
        scrollPercentage <= 99 ? 'translate-y-0' : 'translate-y-[-52px]',
      )}
    >
      <div className='flex flex-row justify-between w-full items-center'>
        <div className='overflow-hidden text-ellipsis whitespace-nowrap text-slate-800 dark:text-white leading-[1.3] mr-4 overflow-hidden overflow-ellipsis whitespace-nowrap text-xl font-bold'>
          {blog.title}
        </div>

        <SubscribeButton size='xl' className='whitespace-nowrap' />
      </div>

      <div className='bg-[#e6e6e6] dark:bg-slate-600 bottom-[-2px] h-[2px] left-0 absolute w-full'>
        <div
          className='bg-orange-400 h-full duration-200 transition-transform'
          style={{ transform: `translate3d(-${scrollPercentage}%, 0px, 0px)` }}
        ></div>
      </div>
    </header>
  )
}
