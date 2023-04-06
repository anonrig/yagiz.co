import { allTags, allBlogs, Blog } from 'contentlayer/generated'
import { compareDesc,format } from 'date-fns'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import BlogRow from '@/ui/components/blog-row'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return allTags.map(tag => tag.slug)
}

export function generateMetadata({ params }: Props): Metadata {
  const tag = allTags.find(t => t.slug === params.slug)
  if (!tag) {
    return {
      title: 'Not Found'
    }
  }
  return {
    title: tag.title,
    description: tag.description,
    openGraph: {
      title: tag.title,
      description: tag.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: tag.title,
      description: tag.description,
    },
  }
}

export default function Blog({ params }: Props) {
  const tag = allTags.find(t => t.slug === params.slug)

  if (!tag) {
    notFound()
  }

  const otherTags = allTags.filter(t => t._id !== tag._id)
  const blogs = allBlogs.sort((a, b) => {
    return compareDesc(new Date(a.date), new Date(b.date))
  }).filter(b => b.tag?._id === tag._id)

  return (
    <section>
      <div className='mx-auto mt-[-1.5rem] w-full max-w-[calc(750px+8vw)] px-[4vw] text-center gap-8 flex flex-col'>
        <h1 className='text-orange-400 text-4xl font-extrabold leading-[1.3]'>
          #{tag.title}
        </h1>

        <div className='text-[1.7rem]'>
          {tag.description}
        </div>

        <div>
          <span className='font-bold text-slate-400 mt-2 mr-2'>More:</span>
            {otherTags.map(tag => (
              <Link
                href={`/tag/${tag.slug}`}
                key={tag.slug}
                className='ml-1 text-slate-800 font-bold break-keep hover:text-slate-600'
              >
                #{tag.title}
              </Link>
            ))}
        </div>
      </div>

      <div className='flex grow py-[6rem]'>
        <div className='mx-auto w-full max-w-[calc(750px+8vw)] divide-y divide-slate-200 px-[4vw]'>
          {blogs.map((blog) => <BlogRow blog={blog} key={blog._id}/>)}
        </div>
      </div>
    </section>
  )
}
