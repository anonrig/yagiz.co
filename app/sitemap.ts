import { allBlogs } from "contentlayer/generated"

export default async function sitemap() {
  const blogs = allBlogs.map(blog => ({
    url: `https://yagiz.co/${blog.slug}`,
    lastModified: new Date(blog.date).toISOString(),
  }))

  const staticPages = [
    '/about',
    '/press',
    '/contact',
  ]
  return [
    ...blogs,
    ...staticPages.map(route => ({
      url: `https://yagiz.co${route}`,
      lastModified: new Date().toISOString(),
    })),
  ];
}
