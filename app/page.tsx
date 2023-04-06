import { allBlogs } from 'contentlayer/generated'
import { compareDesc } from 'date-fns'
import Image from 'next/image'
import BlogRow from '@/ui/components/blog-row'

export default function Home() {
  const blogs = allBlogs.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date))
  })

  return (
    <>
      <div className='mx-auto mt-[-1.5rem] w-full max-w-[calc(1130px+8vw)] px-[4vw]'>
        <div className='mx-auto my-0 flex max-w-[500px] flex-col items-center text-center'>
          <div className='relative mb-[2rem]'>
            <Image alt='Engineering with Yagiz' src='/family.png' width={150} height={150} />
          </div>
          <div className='text-[1.7rem]'>
            Here's a collection of posts about my thoughts, stories, ideas and experiences as a human, and an engineer working with different technologies.
          </div>
        </div>
      </div>

      <div className='flex grow py-[6rem]'>
        <div className='mx-auto w-full max-w-[calc(750px+8vw)] divide-y divide-slate-200 px-[4vw]'>
          {blogs.map((blog) => <BlogRow blog={blog} key={blog._id}/>)}
        </div>
      </div>
    </>
  )
}
