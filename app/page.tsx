import { allBlogs } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import Image from 'next/image'

import BlogRow from '@/ui/components/blog-row'
import Container from '@/ui/components/container'

export default function Home() {
  const blogs = allBlogs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <>
      <Container className='mt-[-1.5rem]'>
        <div className='mx-auto my-0 flex max-w-[500px] flex-col items-center text-center'>
          <div className='relative mb-[2rem]'>
            <Image alt='Engineering with Yagiz' src='/family.png' width={150} height={150} />
          </div>
          <div className='text-[1.7rem] leading-[1.6] dark:text-zinc-200'>
            Here's a collection of posts about my thoughts, stories, ideas and experiences as a human, and an engineer working with different technologies.
          </div>
        </div>
      </Container>

      <div className='flex grow py-[6rem]'>
        <Container size='tight' className='divide-y divide-slate-200 dark:divide-neutral-700'>
          {blogs.map((blog) => <BlogRow blog={blog} key={blog._id}/>)}
        </Container>
      </div>
    </>
  )
}
