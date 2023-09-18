import { Blog } from 'contentlayer/generated'
import { format } from 'date-fns'
import { ChevronRight } from 'lucide-react'
import type { Route } from 'next'
import Link from 'next/link'

export default function BlogRow({ blog }: { blog: Blog }) {
  return (
    <Link
      href={`/${blog.slug}` as Route}
      className="group relative flex items-center overflow-hidden py-3"
    >
      <time
        dateTime={blog.date}
        className="mr-6 flex min-w-[45px] whitespace-nowrap text-xs font-extrabold uppercase text-orange-400"
      >
        {format(new Date(blog.date), 'MMM dd')}
      </time>
      <div className="overflow-hidden whitespace-nowrap text-ellipsis w-full pr-4 leading-6">
        <h2 className="truncate font-normal dark:text-white dark:group-hover:text-neutral-300 group-hover:text-slate-600">
          {blog.title}
        </h2>
      </div>
      <div className="flex items-center transition-margin delay-0 duration-200 ease-in-out group-hover:mr-2">
        <div className="whitespace-nowrap text-sm text-neutral-500">{blog.minute_to_read}</div>
      </div>
      <ChevronRight
        size={16}
        className="translate-x-8 text-slate-600 transition-transform delay-0 duration-200 ease-in-out group-hover:translate-x-0"
      />
    </Link>
  )
}
