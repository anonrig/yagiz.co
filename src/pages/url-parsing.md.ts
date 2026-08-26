export const prerender = true

import { getCollection } from 'astro:content'
import type { APIRoute } from 'astro'
import { websiteUrl } from '@/lib/content'
import { postsInSeries, SERIES } from '@/lib/series'
import { markdownResponse, seriesToMarkdown } from '@/lib/to-markdown'

export const GET: APIRoute = async () => {
  const series = SERIES['url-parsing']
  const allPosts = await getCollection('blog', ({ data }) => data.status === 'published')
  const posts = postsInSeries(allPosts, series.id)

  return markdownResponse(
    seriesToMarkdown(series.title, series.description, series.path, posts),
    `${websiteUrl}${series.path}`,
  )
}
