export function countWords(body: string | undefined): number {
  return (body ?? '').trim().split(/\s+/u).filter(Boolean).length
}

export function readingTimeMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200))
}

export function readingTimeLabel(body: string | undefined): string {
  return `${readingTimeMinutes(countWords(body))} min read`
}

export function readingTimeIso(body: string | undefined): string {
  return `PT${readingTimeMinutes(countWords(body))}M`
}
