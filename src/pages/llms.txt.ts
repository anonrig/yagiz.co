export const prerender = true

import { getCollection } from 'astro:content'
import type { APIRoute } from 'astro'
import { authorFullName, websiteDescription, websiteTitle, websiteUrl } from '@/lib/content'

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => data.status === 'published')
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  const postLinks = posts
    .map((post) => {
      const date = post.data.date.toISOString().split('T')[0]
      return `- [${post.data.title}](${websiteUrl}/${post.id}.md): ${post.data.description} (${date})`
    })
    .join('\n')

  const content = [
    `# ${websiteTitle}`,
    '',
    `> ${websiteDescription}`,
    '',
    '## Pages',
    '',
    `- [About](${websiteUrl}/about.md): Background, work history, and open source contributions by ${authorFullName}`,
    `- [Press](${websiteUrl}/press.md): Articles, interviews, presentations, and podcast appearances featuring ${authorFullName}`,
    `- [Newsletter](${websiteUrl}/newsletter.md): Subscribe to get new posts delivered by email`,
    '',
    '## Blog Posts',
    '',
    postLinks,
    '',
    '## Optional',
    '',
    `- [Contact](${websiteUrl}/contact.md): Get in touch with ${authorFullName}`,
    `- [RSS feed](${websiteUrl}/rss.xml): Full RSS feed of all published posts`,
  ].join('\n')

  return new Response(content, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
