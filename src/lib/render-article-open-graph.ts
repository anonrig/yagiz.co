import fs from 'node:fs/promises'
import path from 'node:path'

import type { CollectionEntry } from 'astro:content'
import satori from 'satori'
import sharp from 'sharp'

import { BlogOG } from '@/components/BlogOG'

const fontData = fs.readFile(path.resolve('./public/fonts/mulish.ttf'))
const boldFontData = fs.readFile(path.resolve('./public/fonts/mulish-bold.ttf'))

export async function renderArticleOpenGraph(
  post: CollectionEntry<'blog'>,
  width: number,
  height: number,
): Promise<Uint8Array> {
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
    height,
    width,
  })

  return sharp(Buffer.from(svg), { failOn: 'error' }).png().toBuffer()
}
