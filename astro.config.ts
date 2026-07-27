import cloudflare from '@astrojs/cloudflare'
import { unified } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, fontProviders } from 'astro/config'
import rehypeAutolinkHeadings, {
  type Options as RehypeAutolinkHeadingsOptions,
} from 'rehype-autolink-headings'
import rehypePrettyCode, { type Options as RehypePrettyCodeOptions } from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { websiteUrl } from './src/lib/content.ts'

function isMarkdownOrLlmsAsset(page: string): boolean {
  return page.endsWith('.md') || page.endsWith('/llms.txt') || page.endsWith('/llms-full.txt')
}

// https://astro.build/config
export default defineConfig({
  // Keep previous HTML-aware whitespace handling (v7 defaults to JSX rules).
  compressHTML: true,
  // Stay on unified/remark/rehype for existing plugins (rehype-pretty-code, etc.).
  // MDX inherits markdown.processor options in Astro 7.
  markdown: {
    processor: unified({
      gfm: true,
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
  },
  security: { csp: true },
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
    mdx({
      syntaxHighlight: false,
    }),
    sitemap({
      lastmod: new Date(),
      // Markdown / llms endpoints are for agents; keep them out of the HTML sitemap.
      filter: (page) => !isMarkdownOrLlmsAsset(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['node:fs/promises', 'node:path', 'node:url', 'node:crypto'],
    },
  },
})
