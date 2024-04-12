import fs from 'node:fs/promises'
import path from 'node:path'
import { getCollection } from 'astro:content'
import type { CollectionEntry } from 'astro:content'
import { BlogOG } from '@/components/BlogOG'
import type { APIRoute, GetStaticPaths } from 'astro'
import { compareDesc } from 'date-fns'
import satori from 'satori'
import sharp from 'sharp'

interface Props {
  post: CollectionEntry<'blog'>
}

const WIDTH = 1200
const HEIGHT = 600

const fontData = fs.readFile(path.resolve('./public/fonts/mulish.ttf'))

export async function getStaticPaths(): Promise<ReturnType<GetStaticPaths>> {
  const posts = await getCollection('blog', ({ data }) => data.status === 'published')
  posts.sort((a, b) => compareDesc(a.data.date, b.data.date))

  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }))
}

export const GET: APIRoute<Props> = async ({ props: { post } }) => {
  const svg = await satori(BlogOG({ post }), {
    fonts: [
      {
        name: 'Mulish Variable',
        data: await fontData,
        style: 'normal',
      },
    ],
    height: HEIGHT,
    width: WIDTH,
  })

  const image = sharp(Buffer.from(svg), {
    failOn: 'error',
  }).png()
  const buffer = await image.toBuffer()

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
