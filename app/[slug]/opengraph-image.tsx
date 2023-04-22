import { allBlogs  } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/server'

import BlogImage from '@/ui/blog-image'

export const runtime = 'edge'
export const size = { width: 1920, height: 1080 }
export const contentType = 'image/png'

export default function og({ params }: { params: { slug: string }}) {
  const blog = allBlogs.find(b => b.slug === params.slug)

  if (!blog) {
    notFound()
  }

  return new ImageResponse(<BlogImage title={blog.title} />, size)
}
