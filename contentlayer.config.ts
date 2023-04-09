import {ComputedFields,defineDocumentType, defineNestedType, makeSource} from 'contentlayer/source-files';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import path from 'node:path'

const computedFields: ComputedFields = {
  slug: {
    type: 'string',
    resolve: (doc) => doc._raw.flattenedPath,
  },
  structuredData: {
    type: 'json',
    resolve: (doc) => ({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: doc.title,
      datePublished: doc.publishedAt,
      dateModified: doc.publishedAt,
      description: doc.summary,
      image: doc.image
        ? `https://yagiz.co${doc.image}`
        : `https://yagiz.co/api/og?title=${doc.title}`,
      url: `https://yagiz.co/${doc._raw.flattenedPath}`,
      author: {
        '@type': 'Person',
        name: 'Yagiz Nizipli',
      },
    }),
  },
};

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
  computedFields,
}));

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Blog, Page, Tag],
  mdx: {
    remarkPlugins: [remarkGfm],
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
              node.children = [{type: 'text', value: ' '}];
            }
          },
          onVisitHighlightedLine(node: any) {
            node.properties.className.push('line--highlighted');
          },
          onVisitHighlightedWord(node: any) {
            node.properties.className = ['word--highlighted'];
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
});
