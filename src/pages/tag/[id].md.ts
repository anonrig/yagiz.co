export const prerender = true

import { type CollectionEntry, getCollection } from 'astro:content'
import type { APIContext, GetStaticPaths } from 'astro'
import { tagToMarkdown } from '@/lib/to-markdown'

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = await getCollection('tags')
  return tags.map((tag) => ({ params: { id: tag.id }, props: { tag } }))
}

export async function GET({ props, params }: APIContext) {
  const tag = props.tag as CollectionEntry<'tags'>
  const posts = await getCollection(
    'blog',
    ({ data }) => data.status === 'published' && data.tag.id === params.id,
  )
  posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

  return new Response(tagToMarkdown(tag, posts), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
  })
}
