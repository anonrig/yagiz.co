import { allBlogs, allTags } from "contentlayer/generated"
import { format } from 'date-fns'

export default async function sitemap() {
  const blogs = allBlogs.map(blog => ({
    url: `https://yagiz.co/${blog.slug}`,
    lastModified: format(new Date(blog.date), 'yyyy-MM-dd'),
  }))

  const tags = allTags.map(tag => ({
    url: `https://yagiz.co/tag/${tag.slug}`,
    lastModified: format(new Date(), 'yyyy-MM-dd'),
  }))

  const staticPages = ['about', 'press', 'contact'].map(page => ({
    url: `https://yagiz.co/${page}`,
    lastModified: format(new Date(), 'yyyy-MM-dd'),
  }))

  return [
    ...blogs,
    ...tags,
    ...staticPages,
  ];
}
