import type { CollectionEntry } from 'astro:content'

export const SERIES = {
  'url-parsing': {
    id: 'url-parsing',
    title: 'URL parsing',
    path: '/url-parsing',
    description:
      'A series on WHATWG URL parsing, Ada, Node.js, and the SIMD and serialization work behind them.',
  },
} as const

export type SeriesId = keyof typeof SERIES

export function isSeriesId(value: string): value is SeriesId {
  return value in SERIES
}

export function seriesDefinition(id: SeriesId): (typeof SERIES)[SeriesId] {
  return SERIES[id]
}

export function postsInSeries(
  posts: CollectionEntry<'blog'>[],
  id: SeriesId,
): CollectionEntry<'blog'>[] {
  return posts
    .filter((post) => post.data.series === id)
    .toSorted((a, b) => a.data.date.getTime() - b.data.date.getTime())
}

export function seriesNeighbors(
  current: CollectionEntry<'blog'>,
  all: CollectionEntry<'blog'>[],
): {
  series: (typeof SERIES)[SeriesId]
  previous?: CollectionEntry<'blog'>
  next?: CollectionEntry<'blog'>
} | null {
  if (!current.data.series) {
    return null
  }

  const series = SERIES[current.data.series]
  const ordered = postsInSeries(all, current.data.series)
  const index = ordered.findIndex((post) => post.id === current.id)
  if (index === -1) {
    return null
  }

  return {
    series,
    previous: index > 0 ? ordered[index - 1] : undefined,
    next: index < ordered.length - 1 ? ordered[index + 1] : undefined,
  }
}
