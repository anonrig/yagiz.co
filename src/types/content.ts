import type { getPages, getPosts, getTags } from '@/lib/content'

export type Post = Awaited<ReturnType<typeof getPosts>>[number]
export type Tag = Awaited<ReturnType<typeof getTags>>[number]
export type Page = Awaited<ReturnType<typeof getPages>>[number]
