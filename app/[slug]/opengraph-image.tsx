/* eslint-disable @next/next/no-img-element */

import { ImageResponse } from 'next/server'

import { githubImage } from "@/app/content";
import { sortedBlogs } from '@/app/content'

export const runtime = 'edge'
export const size = { width: 1200, height: 600 }
export const contentType = 'image/png'

type Context = {
  params: { slug: string }
}

export default function og({ params }: Context) {
  const blog = sortedBlogs.find(blog => blog.slug === params.slug)
  if (!blog) {
    return new Response('Not found', { status: 404 })
  }
  return new ImageResponse((
    <div tw='h-full w-full flex flex-col items-start px-[70px] py-[90px] bg-slate-50 justify-between text-black'>
      <div tw='text-[70px]' style={{ whiteSpace: 'pre-wrap' }}>
        {blog.title}
      </div>

      <div tw='flex flex-row justify-center text-[40px] items-center'>
        <img src={githubImage} tw='rounded-full w-24 h-24' alt='Yagiz Nizipli' />
        <div tw='flex flex-col pl-[30px]'>
          <div tw='text-orange-500'>
            Yagiz Nizipli
          </div>
          Software Engineer
        </div>
      </div>
    </div>
  ), {
    width: 1200,
    height: 600,
  })
}
