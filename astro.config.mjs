import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import { defineConfig, passthroughImageService } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://yagiz.co',
  integrations: [mdx(), sitemap(), tailwind()],
  markdown: {
    syntaxHighlight: 'shiki',
    gfm: true,
    rehypePlugins: [rehypeHeadingIds],
  },
  image: {
    service: passthroughImageService()
  }
})
