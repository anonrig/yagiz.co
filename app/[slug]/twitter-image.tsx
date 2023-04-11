import type { NextConfig } from 'next'
import { notFound } from 'next/navigation'
import { ImageResponse } from 'next/server'

import { sortedBlogs } from '@/app/content'
import BlogImage from '@/ui/blog-image'

export const config: NextConfig = { runtime: 'edge' }
export const size = { width: 1920, height: 1080 }
export const contentType = 'image/png'

export default function twitter({ params }: { params: { slug: string }}) {
  const blog = sortedBlogs.find(b => b.slug === params.slug)

  if (!blog) {
    notFound()
  }

  return new ImageResponse(<BlogImage title={blog.title} />, size)
}
