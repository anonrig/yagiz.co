export const prerender = true

import type { APIContext, GetStaticPaths } from 'astro'
import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

import { websiteUrl } from '@/lib/content'
import { markdownResponse, pageToMarkdown, postToMarkdown } from '@/lib/to-markdown'

type Props =
  | { type: 'post'; entry: CollectionEntry<'blog'> }
  | { type: 'page'; entry: CollectionEntry<'pages'> }

export const getStaticPaths: GetStaticPaths = async () => {
  const [posts, pages] = await Promise.all([
    getCollection('blog', ({ data }) => data.status === 'published'),
    getCollection('pages'),
  ])

  return [
    ...posts.map((entry) => ({
      params: { slug: entry.id },
      props: { type: 'post' as const, entry },
    })),
    ...pages.map((entry) => ({
      params: { slug: entry.id },
      props: { type: 'page' as const, entry },
    })),
  ]
}

export function GET({ props }: APIContext): Response {
  const { type, entry } = props as Props
  const markdown = type === 'post' ? postToMarkdown(entry) : pageToMarkdown(entry)
  const canonical = `${websiteUrl}/${entry.id}`

  return markdownResponse(markdown, canonical)
}
