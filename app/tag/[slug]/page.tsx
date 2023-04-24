import type { Metadata, Route } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { sortedBlogs, sortedTags } from '@/app/content'
import BlogRow from '@/components/blog-row'
import Container from '@/components/ui/container'

type Props = {
  params: { slug: string }
}

// Force static rendering and static data fetching of a layout or page
export const dynamic = 'force-static'

// Dynamic segments not included in generateStaticParams will return a 404.
export const dynamicParams = false

export function generateStaticParams(): Props['params'][] {
  return sortedTags.map(tag => ({ slug: tag.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  const tag = sortedTags.find(t => t.slug === params.slug)
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

export default function Tag({ params }: Props) {
  const tag = sortedTags.find(t => t.slug === params.slug)

  if (!tag) {
    notFound()
  }

  const otherTags = sortedTags.filter(t => t._id !== tag._id)
  const blogs = sortedBlogs.filter(b => b.tag?._id === tag._id)

  return (
    <section>
      <Container size='tight' className='-mt-6 flex flex-col gap-8 text-center'>
        <h1 className='text-2xl font-extrabold text-orange-400'>
          #{tag.title}
        </h1>

        <div className='leading-6 dark:text-white'>
          {tag.description}
        </div>

        <div>
          <span className='mr-2 mt-2 font-bold dark:text-white'>More:</span>
            {otherTags.map(tag => (
              <Link
                href={`/tag/${tag.slug}` as Route}
                key={tag.slug}
                className='ml-1 break-keep font-bold text-neutral-500 hover:text-neutral-400 dark:text-neutral-500 dark:hover:text-neutral-400'
              >
                #{tag.title}
              </Link>
            ))}
        </div>
      </Container>

      <div className='flex grow py-14'>
        <Container size='tight' className='divide-y divide-slate-200 dark:divide-neutral-700'>
          {blogs.map((blog) => <BlogRow blog={blog} key={blog._id} />)}
        </Container>
      </div>
    </section>
  )
}
