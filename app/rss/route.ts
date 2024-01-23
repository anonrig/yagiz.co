import { Feed } from 'feed'

import { sortedBlogs, websiteDomain } from '@/app/content'

// TODO: Remove this line when I find an edge compatible RSS lib.
export const runtime = 'nodejs'

export async function GET() {
  const feed = new Feed({
    title: 'Engineering with Yagiz',
    description:
      "Here's a collection of posts about my thoughts, stories, ideas and experiences as a human, and an engineer working with different technologies.",
    id: websiteDomain,
    link: websiteDomain,
    language: 'en-us',
    favicon: new URL('/favicon.co', websiteDomain).href,
    copyright: 'Yagiz Nizipli - yagiz.co',
    author: {
      name: 'Yagiz Nizipli',
      link: new URL('/contact', websiteDomain).href,
    },
  })

  for (const blog of sortedBlogs) {
    const url = `${websiteDomain}/${blog.slug}`
    feed.addItem({
      title: blog.title,
      id: url,
      link: url,
      description: blog.description,
      date: new Date(blog.date),
      image: blog.feature_image
        ? `${websiteDomain}${blog.feature_image}`
        : `${websiteDomain}/${blog.slug}/opengraph-image`,
    })
  }

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'content-type': 'text/xml',
    },
  })
}
