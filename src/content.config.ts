import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { defineCollection, reference } from 'astro:content'

const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        tag: reference('tags'),
        image: z
          .object({
            src: z.preprocess((v) => `@/assets/content/${String(v)}`, image()),
            alt: z.string().min(1),
          })
          .optional(),
        status: z.enum(['published', 'draft']),
        canonical_url: z.string().optional(),
        updated: z.coerce.date().optional(),
        series: z.enum(['url-parsing']).optional(),
      })
      .refine((data) => !data.updated || data.updated.getTime() >= data.date.getTime(), {
        message: 'updated must be on or after date',
        path: ['updated'],
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
          src: z.preprocess((v) => `@/assets/${String(v)}`, image()),
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
