export const prerender = true

import type { APIContext, GetStaticPaths } from 'astro'
import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

import { websiteUrl } from '@/lib/content'
import { markdownResponse, tagToMarkdown } from '@/lib/to-markdown'

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = await getCollection('tags')
  return tags.map((tag) => ({ params: { id: tag.id }, props: { tag } }))
}

export async function GET({ props, params }: APIContext): Promise<Response> {
  const tag = props.tag as CollectionEntry<'tags'>
  const collected = await getCollection(
    'blog',
    ({ data }) => data.status === 'published' && data.tag.id === params.id,
  )
  const posts = collected.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())

  return markdownResponse(tagToMarkdown(tag, posts), `${websiteUrl}/tag/${tag.id}`)
}
