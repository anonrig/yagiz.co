import { getCollection } from 'astro:content'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, websiteUrl } from '@/lib/content'
import rss, { type RSSFeedItem } from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { compareDesc } from 'date-fns'

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', (post) => post.data.status === 'published')
  posts.sort((a, b) => compareDesc(a.data.date, b.data.date))

  return rss({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    site: new URL(websiteUrl),
    customData: `
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<docs>https://validator.w3.org/feed/docs/rss2.html</docs>
<language>en-us</language>
<copyright>Yagiz Nizipli - yagiz.co</copyright>
`,
    items: posts.map((post): RSSFeedItem => {
      return {
        title: post.data.title,
        description: post.data.description,
        customData: `<guid>${`/${post.slug}`}</guid>`,
        link: `/${post.slug}`,
        pubDate: post.data.date,
        author: 'Yagiz Nizipli',
      }
    }),
  })
}
