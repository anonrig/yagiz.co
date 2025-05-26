import { defineCollection, reference, z } from 'astro:content'
import { glob } from 'astro/loaders'

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      tag: reference('tags'),
      image: z
        .object({
          src: z.preprocess((v) => `@/assets/content/${v}`, image()),
          alt: z.string().optional().default(''),
        })
        .optional(),
      status: z.enum(['published', 'draft']),
      canonical_url: z.string().optional(),
    }),
})

const tags = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/tags' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
})

const pages = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      image: z
        .object({
          src: z.preprocess((v) => `@/assets/${v}`, image()),
          alt: z.string(),
          caption: z.string().optional(),
        })
        .optional(),
    }),
})

export const collections = {
  blog,
  tags,
  pages,
}
