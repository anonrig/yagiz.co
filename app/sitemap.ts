import { format } from 'date-fns'
import type { MetadataRoute } from 'next'

import { sortedBlogs, sortedTags, websiteDomain } from '@/app/content'

// Force static rendering and static data fetching of a layout or page
export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = format(new Date(), 'yyyy-MM-dd')
  const blogs: MetadataRoute.Sitemap = sortedBlogs.map((blog) => ({
    url: `${websiteDomain}/${blog.slug}`,
    lastModified: format(new Date(blog.date), 'yyyy-MM-dd'),
  }))

  const tags: MetadataRoute.Sitemap = sortedTags.map((tag) => ({
    url: `${websiteDomain}/tag/${tag.slug}`,
    lastModified,
  }))

  const staticPages: MetadataRoute.Sitemap = ['about', 'press', 'contact'].map((page) => ({
    url: `${websiteDomain}/${page}`,
    lastModified,
  }))

  return [{ url: websiteDomain, lastModified }, ...blogs, ...tags, ...staticPages]
}
