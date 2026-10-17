export const prerender = true

import rss from '@astrojs/rss'
import type { RSSFeedItem } from '@astrojs/rss'
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

import {
  articleWideImage,
  authorFullName,
  websiteDescription,
  websiteTitle,
  websiteUrl,
} from '@/lib/content'
import { postModifiedDate } from '@/lib/schema'

function escapeXml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export async function GET(): Promise<ReturnType<APIRoute>> {
  const [collected, tags] = await Promise.all([
    getCollection('blog', (post) => post.data.status === 'published'),
    getCollection('tags'),
  ])
  const posts = collected.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())
  const tagTitles = new Map(tags.map((tag) => [tag.id, tag.data.title]))
  let latest: Date | undefined
  for (const post of posts) {
    const modified = postModifiedDate(post)
    if (latest === undefined || modified > latest) {
      latest = modified
    }
  }

  return rss({
    title: websiteTitle,
    description: websiteDescription,
    site: new URL(websiteUrl),
    xmlns: {
      atom: 'http://www.w3.org/2005/Atom',
      dc: 'http://purl.org/dc/elements/1.1/',
      media: 'http://search.yahoo.com/mrss/',
    },
    trailingSlash: false,
    customData: `
<atom:link href="${websiteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${latest === undefined ? '' : `<lastBuildDate>${latest.toUTCString()}</lastBuildDate>`}
<language>en-us</language>
<copyright>${escapeXml(authorFullName)} - yagiz.co</copyright>
`,
    items: posts.map((post): RSSFeedItem => {
      const imageUrl = `${websiteUrl}/${post.id}/${articleWideImage.file}`
      return {
        title: post.data.title,
        description: post.data.description,
        link: `/${post.id}`,
        pubDate: post.data.date,
        categories: [tagTitles.get(post.data.tag.id) ?? post.data.tag.id],
        customData: `<dc:creator>${escapeXml(authorFullName)}</dc:creator>
<media:content url="${imageUrl}" medium="image" type="image/png" width="${String(articleWideImage.width)}" height="${String(articleWideImage.height)}"/>
<media:title>${escapeXml(post.data.title)}</media:title>`,
      }
    }),
  })
}
