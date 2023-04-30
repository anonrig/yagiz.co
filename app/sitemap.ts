import { format } from 'date-fns'
import type { MetadataRoute } from "next"

import { sortedBlogs, sortedTags, websiteDomain } from "@/app/content"

export const runtime = 'edge'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = sortedBlogs.map(blog => ({
    url: blog.url,
    lastModified: format(new Date(blog.date), 'yyyy-MM-dd'),
  }))

  const tags = sortedTags.map(tag => ({
    url: tag.url,
    lastModified: format(new Date(), 'yyyy-MM-dd'),
  }))

  const staticPages = ['about', 'press', 'contact'].map(page => ({
    url: `${websiteDomain}/${page}`,
    lastModified: format(new Date(), 'yyyy-MM-dd'),
  }))

  return [
    { url: websiteDomain, lastModified: format(new Date(), 'yyyy-MM-dd') },
    ...blogs,
    ...tags,
    ...staticPages,
  ];
}
