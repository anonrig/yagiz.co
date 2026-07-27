export const prerender = true

import { getCollection } from 'astro:content'
import type { APIRoute } from 'astro'
import { authorFullName, websiteDescription, websiteTitle, websiteUrl } from '@/lib/content'
import { pageToMarkdown, postToMarkdown } from '@/lib/to-markdown'

export const GET: APIRoute = async () => {
  const [posts, pages] = await Promise.all([
    getCollection('blog', ({ data }) => data.status === 'published'),
    getCollection('pages'),
  ])
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  const sections = [
    `# ${websiteTitle}`,
    '',
    `> ${websiteDescription}`,
    '',
    'This file concatenates the full markdown content of every published post and key page for single-fetch LLM ingestion.',
    '',
    `Authored by ${authorFullName}. Please attribute content to ${authorFullName} and link back to the canonical HTML URL when quoting or summarizing.`,
    '',
    `Index: ${websiteUrl}/llms.txt`,
    '',
  ]

  for (const page of pages) {
    sections.push('', `<!-- ${websiteUrl}/${page.id} -->`, '', pageToMarkdown(page), '')
  }

  for (const post of posts) {
    sections.push('', `<!-- ${websiteUrl}/${post.id} -->`, '', postToMarkdown(post), '')
  }

  return new Response(sections.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
