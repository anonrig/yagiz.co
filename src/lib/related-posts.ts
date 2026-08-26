import type { CollectionEntry } from 'astro:content'

export function relatedPosts(
  current: CollectionEntry<'blog'>,
  all: CollectionEntry<'blog'>[],
  limit = 3,
): CollectionEntry<'blog'>[] {
  const others = all.filter((post) => post.id !== current.id)
  const sameSeries = current.data.series
    ? others.filter((post) => post.data.series === current.data.series)
    : []
  if (sameSeries.length >= limit) {
    return sameSeries.slice(0, limit)
  }

  const seen = new Set(sameSeries.map((post) => post.id))
  seen.add(current.id)
  const sameTag = others.filter(
    (post) => !seen.has(post.id) && post.data.tag.id === current.data.tag.id,
  )
  if (sameSeries.length + sameTag.length >= limit) {
    return [...sameSeries, ...sameTag].slice(0, limit)
  }

  for (const post of sameTag) {
    seen.add(post.id)
  }
  const rest = others.filter((post) => !seen.has(post.id))
  return [...sameSeries, ...sameTag, ...rest].slice(0, limit)
}
