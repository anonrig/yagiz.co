import { allBlogs, Blog } from 'contentlayer/generated'
import { compareDesc, format } from 'date-fns'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Script from 'next/script'

import BlogFooter from '@/ui/components/blog-footer'
import BlogStickyHeader from '@/ui/components/blog-sticky-header'
import BlogSuggestion from '@/ui/components/blog-suggestion'
import Figure from '@/ui/components/figure'
import Heading from '@/ui/components/heading'
import Markdown from '@/ui/components/markdown'

type Props = {
  params: { slug: string }
}

export function generateStaticParams() {
  return allBlogs.map(post => post.slug)
}

export function generateMetadata({ params }: Props): Metadata {
  const blog = allBlogs.find(b => b.slug === params.slug)
  if (!blog) {
    return {
      title: 'Not Found'
    }
  }
  return {
    title: blog.title,
    // TODO: Handle description
    description: '',
    openGraph: {
      title: blog.title,
      description: '',
      type: 'article',
      publishedTime: format(new Date(blog.date), 'yyyy-mm-dd'),
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: '',
    },
  }
}

export default function Blog({ params }: Props) {
  const index = allBlogs.findIndex(b => b.slug === params.slug)

  if (index === -1) {
    notFound()
  }

  const blog = allBlogs[index]
  const blogs = allBlogs.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)))

  return (
    <>
      <article className='block'>
        <Script id={`blog-${blog.slug}`} type='application/ld+json'>{JSON.stringify(blog.structuredData)}</Script>

        <header className='mb-[4.5rem] grid grid-cols-canvas text-center'>
          <div className='col-main mb-4 text-lg font-extrabold uppercase text-slate-400'>
            <span>
              <time dateTime={blog.date}>{format(new Date(blog.date), 'MMM dd, yyyy')}</time>
            </span>
            <span className="before:px-[0.7rem] before:font-serif before:leading-[1] before:content-['\02022']">
              {blog.minute_to_read} min read
            </span>
            {blog.tag !== undefined && (
              <span className="before:px-[0.7rem] before:font-serif before:leading-[1] before:content-['\02022']">
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

        <div className='grid grid-cols-canvas text-2xl [&>*]:col-main'>
          <Markdown code={blog.body.code} />
        </div>

        <BlogFooter blogs={blogs} index={index} />
      </article>

      <BlogSuggestion blogs={blogs} index={index}/>
    </>
  )
}
