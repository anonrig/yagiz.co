export const prerender = true

import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'

import { websiteUrl } from '@/lib/content'
import { homeToMarkdown, markdownResponse } from '@/lib/to-markdown'

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog', ({ data }) => data.status === 'published')
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  return markdownResponse(homeToMarkdown(posts), websiteUrl)
}
