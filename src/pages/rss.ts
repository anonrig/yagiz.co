import { extname } from 'node:path'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, getPosts } from '@/lib/content'
import rss from '@astrojs/rss'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ site, url }) => {
  const posts = await getPosts()

  return rss({
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    site: site as URL,
    customData: `
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
<docs>https://validator.w3.org/feed/docs/rss2.html</docs>
<language>en-us</language>
<copyright>Yagiz Nizipli - yagiz.co</copyright>
`,
    items: await Promise.all(
      posts.map(async (post) => {
        const imageUrl = `${url.origin}${
          post.data.image?.src.src ?? `/${post.slug}/opengraph-image.png`
        }`
        const imageLength = await fetch(imageUrl).then((res) =>
          parseInt(res.headers.get('Content-Length') ?? '1'),
        )

        return {
          title: post.data.title,
          customData: `
<guid>${`/${post.slug}`}</guid>
`,
          link: `/${post.slug}`,
          description: post.data.description,
          pubDate: post.data.date,
          enclosure: {
            length: imageLength,
            type: post.data.image
              ? `image/${extname(post.data.image.src.src).slice(1)}`
              : 'image/png',
            url: imageUrl,
          },
        }
      }),
    ),
  })
}
