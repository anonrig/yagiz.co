interface AcceptEntry {
  type: string
  q: number
  specificity: number
}

function parseAccept(header: string): AcceptEntry[] {
  return header
    .split(',')
    .map((raw) => {
      const parts = raw
        .trim()
        .split(';')
        .map((s) => s.trim())
      const type = parts[0]?.toLowerCase()
      if (!type) {
        return null
      }

      let q = 1
      for (const param of parts.slice(1)) {
        const [name, value] = param.split('=').map((s) => s.trim())
        if (name === 'q') {
          const parsed = Number(value)
          if (!Number.isNaN(parsed)) {
            q = Math.max(0, Math.min(1, parsed))
          }
        }
      }

      const specificity = type === '*/*' ? 0 : type.endsWith('/*') ? 1 : 2
      return { type, q, specificity }
    })
    .filter((entry): entry is AcceptEntry => entry !== null)
}

function matches(entry: AcceptEntry, candidate: string): boolean {
  if (entry.type === '*/*') {
    return true
  }
  if (entry.type.endsWith('/*')) {
    return candidate.startsWith(entry.type.slice(0, -1))
  }
  return entry.type === candidate
}

/**
 * RFC 9110 Accept negotiation for a fixed set of produced types.
 * Returns null when every candidate is explicitly rejected (q=0).
 */
export function preferredType(header: string | null, produces: string[]): string | null {
  if (!header) {
    return produces[0] ?? null
  }

  const entries = parseAccept(header)
  if (entries.length === 0) {
    return produces[0] ?? null
  }

  let bestType: string | null = null
  let bestQ = -1
  let bestPosition = Number.POSITIVE_INFINITY

  for (const candidate of produces) {
    let matched: AcceptEntry | null = null
    let matchedPosition = Number.POSITIVE_INFINITY

    for (let idx = 0; idx < entries.length; idx++) {
      const entry = entries[idx]
      if (!matches(entry, candidate)) {
        continue
      }
      if (
        matched === null ||
        entry.specificity > matched.specificity ||
        (entry.specificity === matched.specificity && idx < matchedPosition)
      ) {
        matched = entry
        matchedPosition = idx
      }
    }

    if (matched === null || matched.q <= 0) {
      continue
    }

    if (matched.q > bestQ || (matched.q === bestQ && matchedPosition < bestPosition)) {
      bestQ = matched.q
      bestPosition = matchedPosition
      bestType = candidate
    }
  }

  return bestType
}

export function appendVaryAccept(headers: Headers): void {
  const existing = headers.get('vary')
  if (!existing) {
    headers.set('Vary', 'Accept')
    return
  }
  const tokens = existing.split(',').map((s) => s.trim().toLowerCase())
  if (!tokens.includes('accept')) {
    headers.set('Vary', `${existing}, Accept`)
  }
}

export function appendLink(headers: Headers, value: string): void {
  const existing = headers.get('link')
  headers.set('Link', existing ? `${existing}, ${value}` : value)
}

/** Map an HTML pathname to this site's `.md` sibling (`/about` → `/about.md`). */
export function markdownPath(pathname: string): string {
  const clean = pathname.replace(/\/+$/u, '') || '/'
  if (clean === '/') {
    return '/index.md'
  }
  return `${clean}.md`
}

const STATIC_EXT =
  /\.(?:css|js|mjs|map|png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf|eot|xml|txt|json|pdf|mp4|webm|mp3|wav|ogg|zip|md)$/iu

const IMMUTABLE_ASSET = /\.(?:css|js|mjs|map|png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf|eot)$/iu

export function isImmutableAsset(pathname: string): boolean {
  return pathname.startsWith('/_astro/') || IMMUTABLE_ASSET.test(pathname)
}

export function isAgentOnlyPath(pathname: string): boolean {
  return (
    pathname.endsWith('.md') ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname.endsWith('/llms.txt')
  )
}

/** Paths that should skip HTML↔markdown negotiation. */
export function shouldSkipNegotiation(pathname: string): boolean {
  return (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/cdn-cgi/') ||
    STATIC_EXT.test(pathname)
  )
}
