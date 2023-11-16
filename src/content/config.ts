import { defineCollection, reference, z } from 'astro:content'

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tag: z.array(reference('tag')).or(reference('tag')),
    feature_image: image().optional(),
    feature_image_caption: z.string().optional(),
    status: z.enum(['published', 'draft']).default('draft'),
    canonical_url: z.string().url().optional(),
  }),
})

const page = defineCollection({
  type: 'content',
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    feature_image: image().optional(),
    feature_image_caption: z.string().optional(),
    feature_image_alt: z.string().optional(),
  }),
})

const tag = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
})

export const collections = { blog, page, tag }
