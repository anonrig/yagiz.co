import { Blog } from 'contentlayer/generated'
import { format } from 'date-fns'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function BlogRow({ blog }: { blog: Blog}) {
  return (
    <Link href={blog.slug} className='group relative flex items-center overflow-hidden py-6 leading-[1]'>
      <time dateTime={blog.date} className='mr-6 flex min-w-[45px] whitespace-nowrap text-base font-extrabold uppercase text-orange-400'>
        {format(new Date(blog.date), 'MMM dd')}
      </time>
      <h2 className='w-full grow overflow-hidden text-ellipsis whitespace-nowrap pr-4 text-[1.6rem] font-normal leading-[1.3] dark:text-white dark:group-hover:text-neutral-300 group-hover:text-slate-600'>
        {blog.title}
      </h2>
      <div className='flex items-center transition-margin delay-0 duration-200 ease-in-out group-hover:mr-3'>
        <div className='whitespace-nowrap text-xl text-neutral-500'>
          {blog.minute_to_read} min read
        </div>
      </div>
      <ChevronRight
        size={14}
        className='translate-x-8 text-slate-600 transition-transform delay-0 duration-200 ease-in-out group-hover:translate-x-1.5'
      />
    </Link>
  )
}
