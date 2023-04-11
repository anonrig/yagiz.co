import { allBlogs, allTags } from "contentlayer/generated"
import { format } from 'date-fns'
import type { MetadataRoute } from "next"

export default async function sitemap(): MetadataRoute.Sitemap {
  const blogs = allBlogs.map(blog => ({
    url: `https://www.yagiz.co/${blog.slug}`,
    lastModified: format(new Date(blog.date), 'yyyy-MM-dd'),
  }))

  const tags = allTags.map(tag => ({
    url: `https://www.yagiz.co/tag/${tag.slug}`,
    lastModified: format(new Date(), 'yyyy-MM-dd'),
  }))

  const staticPages = ['about', 'press', 'contact'].map(page => ({
    url: `https://www.yagiz.co/${page}`,
    lastModified: format(new Date(), 'yyyy-MM-dd'),
  }))

  return [
    ...blogs,
    ...tags,
    ...staticPages,
  ];
}
