import path from 'node:path'

import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'

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
    }
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
    minute_to_read: {
      type: 'number',
      required: true,
    }
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
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Blog, Page, Tag],
  mdx: {
    remarkPlugins: [
      remarkGfm,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypePrettyCode,
        {
          theme: 'one-dark-pro',
          onVisitLine(node: any) {
            // Prevent lines from collapsing in `display: grid` mode, and allow empty
            // lines to be copy/pasted
            if (node.children.length === 0) {
              node.children = [{type: 'text', value: ' '}]
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push('line--highlighted')
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ['word--highlighted']
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
