import type { Blog } from 'contentlayer/generated'
import { format } from 'date-fns'
import type { Metadata } from 'next'
import Link from 'next/link'

import { sortedBlogs, websiteDomain } from '@/app/content'
import BlogFooter from '@/components/blog-footer'
import BlogRow from '@/components/blog-row'
import BlogStickyHeader from '@/components/blog-sticky-header'
import Container from '@/components/ui/container'
import Figure from '@/components/ui/figure'
import Heading from '@/components/ui/heading'
import Markdown from '@/components/ui/markdown'

type Props = {
  params: { slug: string }
}

// Force static rendering and static data fetching of a layout or page
export const dynamic = 'force-static'

// Dynamic segments not included in generateStaticParams will return a 404.
export const dynamicParams = false

export function generateStaticParams(): Props['params'][] {
  return sortedBlogs.map(blog => ({ slug: blog.slug }))
}

export function generateMetadata({ params }: Props): Metadata {
  // No need to check if blog exists, dynamicParams=false will return a 404.
  const blog = sortedBlogs.find(b => b.slug === params.slug)!

  return {
    title: blog.title,
    description: blog.description,
    authors: [{ name: 'Yagiz Nizipli' }],
    category: 'technology',
    openGraph: {
      title: blog.title,
      description: blog.description,
      type: 'article',
      publishedTime: format(new Date(blog.date), 'yyyy-MM-dd'),
      tags: blog.tag ? [blog.tag.title] : [],
      siteName: 'Engineering with Yagiz',
      images: [{
        url: `${websiteDomain}/${blog.slug}/og-image.png`,
        width: 1200,
        height: 600,
        alt: blog.title,
        type: 'image/png'
      }],
      locale: 'en-US',
      authors: ['Yagiz Nizipli'],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      images: {
        url: `${websiteDomain}/${blog.slug}/og-image.png`,
        alt: blog.title,
        type: 'image/png',
        width: 1200,
        height: 600,
      },
      siteId: '1589638196',
      creator: '@yagiznizipli',
      creatorId: '1589638196',
    },
  }
}

export default function BlogDetail({ params }: Props) {
  const index = sortedBlogs.findIndex(b => b.slug === params.slug)
  const blog = sortedBlogs[index]
  const suggestions = [
    sortedBlogs.at(index - 2),
    sortedBlogs.at(index - 1),
  ].filter(Boolean) as Blog[]

  return (
    <>
      <article>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blog.structuredData) }}
        />

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

      {suggestions.length > 0 && <section className='mt-24 bg-[#f6f6f6] dark:bg-[#2f333c] py-12'>
        <Container size='tight'>
          <h3 className='mb-4 text-xl font-extrabold dark:text-white'>
            You might also like...
          </h3>
          <div className='divide-y divide-slate-200 dark:divide-neutral-700'>
            {suggestions.map(blog => (<BlogRow blog={blog} key={blog._id} />))}
          </div>
        </Container>
      </section>}
    </>
  )
}
