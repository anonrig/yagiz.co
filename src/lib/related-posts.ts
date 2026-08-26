import type { CollectionEntry } from 'astro:content'

export function relatedPosts(
  current: CollectionEntry<'blog'>,
  all: CollectionEntry<'blog'>[],
  limit = 3,
): CollectionEntry<'blog'>[] {
  const sameTag = all.filter(
    (post) => post.id !== current.id && post.data.tag.id === current.data.tag.id,
  )
  if (sameTag.length >= limit) {
    return sameTag.slice(0, limit)
  }

  const seen = new Set(sameTag.map((post) => post.id))
  seen.add(current.id)
  const rest = all.filter((post) => !seen.has(post.id))
  return [...sameTag, ...rest].slice(0, limit)
}
