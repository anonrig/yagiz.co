/* eslint-disable @next/next/no-img-element */
import BlogImage from '@/ui/blog-image'
import { allBlogs  } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/server'

export const runtime = 'edge'
export const size = { width: 1920, height: 1080 }
export const contentType = 'image/png'

export default function og({ params }: { params: { slug: string }}) {
  const blog = allBlogs.find(b => b.slug === params.slug)

  if (!blog) {
    notFound()
  }

  return new ImageResponse(<BlogImage title={blog.title} />, {
    width: 1920,
    height: 1080,
  })
}
