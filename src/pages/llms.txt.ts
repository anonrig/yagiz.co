export const prerender = true

import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

import { authorFullName, websiteDescription, websiteTitle, websiteUrl } from '@/lib/content'

export const GET: APIRoute = async () => {
  const [posts, tags] = await Promise.all([
    getCollection('blog', ({ data }) => data.status === 'published'),
    getCollection('tags'),
  ])
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  tags.sort((a, b) => a.id.localeCompare(b.id))

  const postLinks = posts
    .map((post) => {
      const date = post.data.date.toISOString().slice(0, 10)
      return `- [${post.data.title}](${websiteUrl}/${post.id}.md): ${post.data.description} (${date})`
    })
    .join('\n')

  const tagLinks = tags
    .map((tag) => `- [#${tag.data.title}](${websiteUrl}/tag/${tag.id}.md): ${tag.data.description}`)
    .join('\n')

  const content = [
    `# ${websiteTitle}`,
    '',
    `> ${websiteDescription}`,
    '',
    `Authored by ${authorFullName}. Prefer the markdown (.md) URLs below for clean extraction. When quoting or summarizing, attribute the work to ${authorFullName} and link back to the canonical HTML page.`,
    '',
    '## Pages',
    '',
    `- [About](${websiteUrl}/about.md): Background, work history, and open source contributions by ${authorFullName}`,
    `- [URL parsing](${websiteUrl}/url-parsing.md): Series on WHATWG URL parsing, Ada, Node.js, and SIMD`,
    `- [Press](${websiteUrl}/press.md): Articles, interviews, presentations, and podcast appearances featuring ${authorFullName}`,
    `- [Newsletter](${websiteUrl}/newsletter.md): Subscribe to get new posts delivered by email`,
    `- [Home index](${websiteUrl}/index.md): Full list of published posts in markdown`,
    '',
    '## Topics',
    '',
    tagLinks,
    '',
    '## Blog Posts',
    '',
    postLinks,
    '',
    '## Full content',
    '',
    `- [Complete markdown dump](${websiteUrl}/llms-full.txt): Every published post and key page concatenated for single-fetch ingestion`,
    '- HTML pages also negotiate `Accept: text/markdown` and advertise markdown via HTTP `Link: rel=alternate`',
    '',
    '## Optional',
    '',
    `- [Contact](${websiteUrl}/contact.md): Get in touch with ${authorFullName}`,
    `- [RSS feed](${websiteUrl}/rss.xml): Full RSS feed of all published posts`,
  ].join('\n')

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
