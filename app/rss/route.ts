import { allBlogs } from 'contentlayer/generated'
import { Feed } from 'feed'

import { metadata } from '../layout'

export async function GET() {
  const feed = new Feed({
    title: metadata.title,
    description: metadata.description,
    id: 'https://www.yagiz.co',
    link: 'https://www.yagiz.co',
    language: 'en',
    favicon: 'https://www.yagiz.co/favicon.ico',
    generator: 'Next.js',
    copyright: 'Yagiz Nizipli - yagiz.co',
    author: {
      name: 'Yagiz Nizipli',
      link: 'https://www.yagiz.co/contact',
    },
  })

  allBlogs.forEach(blog => {
    feed.addItem({
      title: blog.title,
      id: `https://www.yagiz.co/${blog.slug}`,
      link: `https://www.yagiz.co/${blog.slug}`,
      description: blog.description,
      date: new Date(blog.date),
      image: blog.feature_image ? `https://www.yagiz.co${blog.feature_image}` : undefined,
    })
  })

  return new Response(feed.rss2(), {
    status: 200,
    headers: {
      'cache-control': 's-maxage=3600',
      'content-type': 'text/xml',
    },
  })
}
