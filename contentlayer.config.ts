import path from 'node:path'

import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode, { CharsElement, LineElement } from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

import readingTime from 'reading-time'

export const websiteDomain = 'https://www.yagiz.co'

export const Page = defineDocumentType(() => ({
  name: 'Page',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    feature_image: {
      type: 'string',
    },
    feature_image_caption: {
      type: 'string',
    },
    feature_image_alt: {
      type: 'string',
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => path.basename(doc._raw.flattenedPath),
    },
    url: {
      type: 'string',
      resolve: (doc) => {
        const slug = path.basename(doc._raw.flattenedPath)
        return `${websiteDomain}/${slug}`
      },
    },
  },
}))

export const Tag = defineDocumentType(() => ({
  name: 'Tag',
  filePathPattern: 'tags/*.mdx',
  bodyType: 'none',
  fields: {
    title: { type: 'string', required: true },
    description: { type: 'string', required: true },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => path.basename(doc._raw.flattenedPath),
    },
    url: {
      type: 'string',
      resolve: (doc) => {
        const slug = path.basename(doc._raw.flattenedPath)
        return `${websiteDomain}/tag/${slug}`
      },
    },
  },
}))

export const Blog = defineDocumentType(() => ({
  name: 'Blog',
  filePathPattern: '**/*.mdx',
  contentType: 'mdx',
  fields: {
    title: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: true,
    },
    date: {
      type: 'string',
      required: true,
    },
    tag: {
      type: 'reference',
      of: Tag,
      embedDocument: true,
    },
    feature_image: {
      type: 'string',
    },
    feature_image_caption: {
      type: 'string',
    },
    status: {
      type: 'enum',
      options: ['published', 'draft'],
      default: 'draft',
    },
    canonical_url: {
      type: 'string',
    },
  },
  computedFields: {
    slug: {
      type: 'string',
      resolve: (doc) => doc._raw.flattenedPath,
    },
    url: {
      type: 'string',
      resolve: (doc) => `${websiteDomain}/${doc._raw.flattenedPath}`,
    },
    structuredData: {
      type: 'json',
      resolve: (doc) => ({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: doc.title,
        datePublished: doc.date,
        dateModified: doc.date,
        description: doc.description,
        url: `${websiteDomain}/${doc._raw.flattenedPath}`,
        author: {
          '@type': 'Person',
          name: 'Yagiz Nizipli',
        },
      }),
    },
    minute_to_read: {
      type: 'string',
      resolve: (doc) => readingTime(doc.body.raw).text,
    },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Blog, Page, Tag],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        // biome-ignore lint/suspicious/noExplicitAny: Package doesn't have proper types.
        rehypePrettyCode as any,
        {
          theme: 'one-dark-pro',
          keepBackground: false,
          onVisitLine(node: LineElement) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{ type: 'text', value: ' ' }]
            }
          },
          onVisitHighlightedLine(node: LineElement) {
            node.properties.className ??= []
            node.properties.className.push('line--highlighted')
          },
          onVisitHighlightedChars(node: CharsElement) {
            node.properties.className ??= []
            node.properties.className.push('word--highlighted')
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ['anchor'],
          },
        },
      ],
    ],
  },
})
