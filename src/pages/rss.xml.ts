import { getCollection } from 'astro:content'
import rss, { type RSSFeedItem } from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { compareDesc } from 'date-fns'
import { authorFullName, websiteDescription, websiteTitle, websiteUrl } from '@/lib/content'

export async function GET(): Promise<ReturnType<APIRoute>> {
  const posts = await getCollection('blog', (post) => post.data.status === 'published')
  posts.sort((a, b) => compareDesc(a.data.date, b.data.date))

  return rss({
    title: websiteTitle,
    description: websiteDescription,
    site: new URL(websiteUrl),
    customData: `
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<docs>https://validator.w3.org/feed/docs/rss2.html</docs>
<language>en-us</language>
<copyright>${authorFullName} - yagiz.co</copyright>
`,
    items: posts.map((post): RSSFeedItem => {
      return {
        title: post.data.title,
        description: post.data.description,
        customData: `<guid>${`/${post.id}`}</guid>`,
        link: `/${post.id}`,
        pubDate: post.data.date,
        author: authorFullName,
      }
    }),
  })
}
