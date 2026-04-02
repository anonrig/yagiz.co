export const prerender = true

import { getCollection } from 'astro:content'
import type { APIRoute } from 'astro'
import { authorFullName, websiteDescription, websiteTitle } from '@/lib/content'

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => data.status === 'published')
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  const postList = posts
    .map((post) => {
      const date = post.data.date.toISOString().split('T')[0]
      return `- [${post.data.title}](/${post.id}) — ${date}`
    })
    .join('\n')

  const markdown = [
    `# ${websiteTitle}`,
    '',
    `> ${websiteDescription}`,
    '',
    '---',
    '',
    postList,
    '',
    '---',
    '',
    `Authored by ${authorFullName}`,
  ].join('\n')

  return new Response(markdown, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
