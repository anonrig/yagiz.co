import cloudflare from '@astrojs/cloudflare'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwind from '@astrojs/tailwind'
import sentry from '@sentry/astro'
import { defineConfig } from 'astro/config'
import rehypeAutolinkHeadings, {
  type Options as RehypeAutolinkHeadingsOptions,
} from 'rehype-autolink-headings'
import rehypePrettyCode, { type Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { SENTRY_DSN } from './constants'

import spotlightjs from '@spotlightjs/astro'

// https://astro.build/config
export default defineConfig({
  site: 'https://www.yagiz.co',
  output: 'hybrid',
  adapter: cloudflare({
    imageService: 'passthrough',
  }),
  trailingSlash: 'never',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    mdx({
      syntaxHighlight: false,
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [
          rehypePrettyCode,
          {
            theme: 'one-dark-pro',
            keepBackground: false,
            onVisitLine(node) {
              // Prevent lines from collapsing in `display: grid` mode, and allow empty
              // lines to be copy/pasted
              if (node.children.length === 0) {
                node.children = [
                  {
                    type: 'text',
                    value: ' ',
                  },
                ]
              }
            },
            onVisitHighlightedLine(node) {
              node.properties.className ??= []
              node.properties.className.push('line--highlighted')
            },
            onVisitHighlightedChars(node) {
              node.properties.className ??= []
              node.properties.className.push('word--highlighted')
            },
          } satisfies RehypePrettyCodeOptions,
        ],
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ['anchor'],
            },
          } satisfies RehypeAutolinkHeadingsOptions,
        ],
      ],
    }),
    sitemap({
      lastmod: new Date(),
    }),
    sentry({
      dsn: SENTRY_DSN,
      autoInstrumentation: {
        requestHandler: true,
      },
      sourceMapsUploadOptions: {
        org: 'yagiz-nb',
        project: 'yagiz-co',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
      clientInitPath: 'sentry/client.ts',
      serverInitPath: 'sentry/server.ts',
    }),
    spotlightjs(),
  ],
  vite: {
    ssr: {
      noExternal: ['@sentry/astro'],
    },
    optimizeDeps: {
      exclude: ['@resvg/resvg-js'],
    },
  },
})
