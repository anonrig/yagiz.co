import Image from 'next/image'

import { sortedBlogs } from '@/app/content'
import BlogRow from '@/ui/components/blog-row'
import Container from '@/ui/components/container'
import SubscribeButton from '@/ui/subscribe'

export default function Home() {
  return (
    <>
      <Container className='mt-[-1.5rem]'>
        <div className='mx-auto my-0 flex max-w-[500px] flex-col items-center text-center'>
          <div className='relative mb-[2rem]'>
            <Image alt='Engineering with Yagiz' src='/family.png' width={150} height={150} className='rounded-full'/>
          </div>
          <div className='text-[1.7rem] leading-[1.6] dark:text-zinc-200'>
            Here's a collection of posts about my thoughts, stories, ideas and experiences as a human, and an engineer working with different technologies.
          </div>

          <SubscribeButton
            label='Subscribe Now'
            className='mt-6 h-[36px] items-center justify-center rounded-md border-[1px] border-solid border-slate-200 bg-white px-[15px] text-[11px] font-extrabold uppercase tracking-[0.5px] text-orange-400 outline-none hover:border-slate-300 dark:border-neutral-600 dark:bg-white-reversed dark:hover:border-neutral-500'
          />
        </div>
      </Container>

      <div className='flex grow pb-[6rem] pt-[3rem]'>
        <Container size='tight' className='divide-y divide-slate-200 dark:divide-neutral-700'>
          {sortedBlogs.map((blog) => <BlogRow blog={blog} key={blog._id}/>)}
        </Container>
      </div>
    </>
  )
}
