import type { APIRoute, GetStaticPaths } from 'astro'
import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'

import { articleOpenGraphImages } from '@/lib/content'
import { renderArticleOpenGraph } from '@/lib/render-article-open-graph'

interface Props {
  post: CollectionEntry<'blog'>
  width: number
  height: number
}

export async function getStaticPaths(): Promise<ReturnType<GetStaticPaths>> {
  const collected = await getCollection('blog', ({ data }) => data.status === 'published')
  const posts = collected.toSorted((a, b) => b.data.date.getTime() - a.data.date.getTime())

  return posts.flatMap((post) =>
    articleOpenGraphImages.map((variant) => ({
      params: { id: post.id, name: variant.name },
      props: { post, width: variant.width, height: variant.height },
    })),
  )
}

export const GET: APIRoute<Props> = async ({ props }) => {
  const image = await renderArticleOpenGraph(props.post, props.width, props.height)

  return new Response(Uint8Array.from(image), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
