import rss from '@astrojs/rss'
import { site_description, site_title } from '../consts'
import { getCollection } from 'astro:content'

export async function GET(context) {
  const blogs = await getCollection('blog', ({ data }) => data.status === 'published')
  return rss({
    title: site_title,
    description: site_description,
    site: context.site,
    items: blogs.map((blog) => ({
      ...blog.data,
      link: `/blog/${blog.slug}/`,
    })),
  })
}
