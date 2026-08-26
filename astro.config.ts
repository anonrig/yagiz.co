import cloudflare from '@astrojs/cloudflare'
import { cacheCloudflare } from '@astrojs/cloudflare/cache'
import { satteri, satteriHeadingIdsPlugin } from '@astrojs/markdown-satteri'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import { transformerMetaHighlight, transformerMetaWordHighlight } from '@shikijs/transformers'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'

import { websiteUrl } from './src/lib/content.ts'
import { autolinkHeadingsPlugin } from './src/lib/satteri-autolink.ts'
import {
  transformerEmptyLine,
  transformerInlineStylesToClasses,
  transformerMetaTitle,
} from './src/lib/shiki-transformers.ts'
import { loadSitemapLastmods } from './src/lib/sitemap-dates.ts'

function isMarkdownOrLlmsAsset(page: string): boolean {
  return page.endsWith('.md') || page.endsWith('/llms.txt') || page.endsWith('/llms-full.txt')
}

const sitemapLastmods = loadSitemapLastmods()

const pageCache = { maxAge: 3600, swr: 86_400, tags: ['page'] }

// https://astro.build/config
export default defineConfig({
  // Keep previous HTML-aware whitespace handling (v7 defaults to JSX rules).
  compressHTML: true,
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      theme: 'one-dark-pro',
      transformers: [
        transformerMetaTitle(),
        transformerMetaHighlight(),
        transformerMetaWordHighlight(),
        transformerEmptyLine(),
        transformerInlineStylesToClasses(),
      ],
    },
    // Sätteri is Astro 7's default Rust markdown pipeline. Heading IDs must
    // be applied in this user plugin list so autolink can read them; Astro
    // also appends the same heading-id plugin after user plugins.
    processor: satteri({
      hastPlugins: [satteriHeadingIdsPlugin(), autolinkHeadingsPlugin()],
    }),
  },
  // Cloudflare adapter would otherwise wire the unused SESSION KV as a
  // default session driver and keep the session runtime in the Worker bundle.
  session: false,
  experimental: {
    // JSON schemas for blog/page/tag frontmatter in compatible editors.
    contentIntellisense: true,
  },
  security: {
    csp: {
      styleDirective: {
        resources: [{ resource: "'unsafe-inline'", kind: 'attribute' }],
      },
    },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Mulish',
      cssVariable: '--font-mulish',
      display: 'optional',
      options: {
        variants: [
          {
            // Variable font — supports the full weight range (100–900)
            weight: '100 900',
            style: 'normal',
            src: ['./src/assets/fonts/mulish-variable.woff2'],
          },
        ],
      },
    },
  ],
  site: websiteUrl,
  output: 'static',
  cache: {
    provider: cacheCloudflare(),
  },
  routeRules: {
    '/': pageCache,
    '/about': pageCache,
    '/url-parsing': pageCache,
    '/contact': pageCache,
    '/newsletter': pageCache,
    '/press': pageCache,
    '/[id]': pageCache,
    '/tag/[id]': pageCache,
    '/rss.xml': pageCache,
  },
  adapter: cloudflare({
    // Optimize images at build time (sharp). Cloudflare Image Resizing
    // (`/cdn-cgi/image/...`) 404s on workers.dev preview URLs; compile emits
    // plain `/_astro/*` assets that work on preview and production.
    imageService: 'compile',
    // sharp and satori (used in OG image generation) require Node.js APIs
    // that are not compatible with Cloudflare's workerd runtime.
    prerenderEnvironment: 'node',
  }),
  trailingSlash: 'never',
  prefetch: true,
  redirects: {
    '/rss': '/rss.xml',
  },
  integrations: [
    mdx(),
    sitemap({
      // Markdown / llms endpoints are for agents; keep them out of the HTML sitemap.
      // lastmod comes from each post's frontmatter date, not the build clock.
      filter: (page) => !isMarkdownOrLlmsAsset(page),
      serialize(item) {
        const lastmod = sitemapLastmods.get(item.url.replace(/\/+$/u, ''))
        return lastmod ? { ...item, lastmod } : item
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['node:fs/promises', 'node:path', 'node:url', 'node:crypto'],
    },
  },
})
