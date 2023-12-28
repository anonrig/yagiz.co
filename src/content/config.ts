import { defineCollection, reference, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
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
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
})

const pages = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      image: z
        .object({
          src: z.preprocess((v) => `@/assets/${v}`, image()),
          alt: z.string().optional().default(''),
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
