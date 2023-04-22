import { format } from 'date-fns'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { sortedBlogs } from '@/app/content'
import BlogFooter from '@/components/blog-footer'
import BlogStickyHeader from '@/components/blog-sticky-header'
import BlogSuggestion from '@/components/blog-suggestion'
import Figure from '@/components/ui/figure'
import Heading from '@/components/ui/heading'
import Markdown from '@/components/ui/markdown'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return sortedBlogs.map(blog => blog.slug)
}

export function generateMetadata({ params }: Props): Metadata {
  const blog = sortedBlogs.find(b => b.slug === params.slug)
  if (!blog) {
    return {
      title: 'Not Found'
    }
  }
  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: 'article',
      publishedTime: format(new Date(blog.date), 'yyyy-MM-dd'),
      tags: blog.tag ? [blog.tag.title] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
    },
  }
}

export default function Blog({ params }: Props) {
  const index = sortedBlogs.findIndex(b => b.slug === params.slug)
  const blog = sortedBlogs[index]

  if (blog === undefined) {
    notFound()
  }

  return (
    <>
      <article>
        <script type='application/ld+json'>
          {JSON.stringify(blog.structuredData)}
        </script>

        <header className='mb-6 grid grid-cols-canvas text-center'>
          <div className='col-main mb-4 text-xs font-extrabold uppercase text-slate-400'>
            <span>
              <time dateTime={blog.date}>{format(new Date(blog.date), 'MMM dd, yyyy')}</time>
            </span>
            <span className="before:px-2 before:font-serif before:leading-[1] before:content-['\02022']">
              {blog.minute_to_read} min read
            </span>
            {blog.tag !== undefined && (
              <span className="before:px-2 before:font-serif before:leading-[1] before:content-['\02022']">
                <Link href={`/tag/${blog.tag.slug}`} className='text-orange-400 hover:text-orange-300'>
                  {blog.tag.title}
                </Link>
              </span>
            )}
          </div>

          <Heading text={blog.title} />

          {blog.feature_image && (
            <Figure
              alt={blog.title}
              src={blog.feature_image}
              caption={blog.feature_image_caption}
            />
          )}
        </header>

        <BlogStickyHeader blog={blog} />

        <Markdown code={blog.body.code} />

        <BlogFooter index={index} />
      </article>

      <BlogSuggestion index={index}/>
    </>
  )
}
