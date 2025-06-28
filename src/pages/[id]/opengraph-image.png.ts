import type { CollectionEntry } from 'astro:content'
import { getCollection } from 'astro:content'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { APIRoute, GetStaticPaths } from 'astro'
import { compareDesc } from 'date-fns'
import satori from 'satori'
import sharp from 'sharp'
import { BlogOG } from '@/components/BlogOG'
import { openGraphImage } from '@/lib/content'

interface Props {
  post: CollectionEntry<'blog'>
}

const fontData = fs.readFile(path.resolve('./public/fonts/mulish.ttf'))
const boldFontData = fs.readFile(path.resolve('./public/fonts/mulish-bold.ttf'))

export async function getStaticPaths(): Promise<ReturnType<GetStaticPaths>> {
  const posts = await getCollection('blog', ({ data }) => data.status === 'published')
  posts.sort((a, b) => compareDesc(a.data.date, b.data.date))

  return posts.map((post) => ({
    params: { id: post.id },
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
      {
        name: 'mulish-bold',
        data: await boldFontData,
        style: 'normal',
      },
    ],
    height: openGraphImage.height,
    width: openGraphImage.width,
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
