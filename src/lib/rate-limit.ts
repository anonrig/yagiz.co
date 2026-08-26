export const RATE_LIMIT_WINDOW_SEC = 600
export const RATE_LIMIT = 5

export interface RateLimitWindow {
  count: number
  expires: number
}

export function parseWindow(value: unknown): RateLimitWindow | undefined {
  if (typeof value !== 'object' || value === null) {
    return undefined
  }
  if (!('count' in value) || !('expires' in value)) {
    return undefined
  }
  const { count, expires } = value
  if (
    typeof count !== 'number' ||
    typeof expires !== 'number' ||
    !Number.isFinite(count) ||
    !Number.isFinite(expires)
  ) {
    return undefined
  }
  return { count, expires }
}

export function advanceWindow(
  existing: RateLimitWindow | undefined,
  now: number,
): { limited: boolean; next: RateLimitWindow; maxAge: number } {
  const active = existing !== undefined && existing.expires > now
  const count = active ? existing.count : 0
  const expires = active ? existing.expires : now + RATE_LIMIT_WINDOW_SEC * 1000
  const maxAge = Math.max(1, Math.ceil((expires - now) / 1000))
  if (count >= RATE_LIMIT) {
    return { limited: true, next: { count, expires }, maxAge }
  }
  return { limited: false, next: { count: count + 1, expires }, maxAge }
}

interface WorkerCache {
  match: (request: Request) => Promise<Response | undefined>
  put: (request: Request, response: Response) => Promise<void>
}

function clientIp(request: Request): string {
  return (
    request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'local'
  )
}

function defaultCache(): WorkerCache | undefined {
  const store: unknown = Reflect.get(globalThis, 'caches')
  if (typeof store !== 'object' || store === null) {
    return undefined
  }

  const cache: unknown = Reflect.get(store, 'default')
  if (typeof cache !== 'object' || cache === null) {
    return undefined
  }

  const match: unknown = Reflect.get(cache, 'match')
  const put: unknown = Reflect.get(cache, 'put')
  if (typeof match !== 'function' || typeof put !== 'function') {
    return undefined
  }

  return {
    match: async (request) => {
      const result: unknown = await match.call(cache, request)
      return result instanceof Response ? result : undefined
    },
    put: async (request, response) => {
      await put.call(cache, request, response)
    },
  }
}

/**
 * Per-IP fixed window using the Worker Cache API. Fails open if Cache is
 * unavailable (local Node prerender, missing caches). The stored `expires`
 * timestamp is reused so `put` does not restart the 10-minute window.
 */
export async function isRateLimited(request: Request, bucket: string): Promise<boolean> {
  const cache = defaultCache()
  if (cache === undefined) {
    return false
  }

  const ip = clientIp(request)
  const key = new Request(`https://rl.yagiz.co/${bucket}/${ip}`)

  try {
    const existing = await cache.match(key)
    const parsed = existing === undefined ? undefined : parseWindow(await existing.json())
    const { limited, next, maxAge } = advanceWindow(parsed, Date.now())
    if (limited) {
      return true
    }

    await cache.put(
      key,
      Response.json(next, {
        headers: { 'Cache-Control': `max-age=${maxAge}` },
      }),
    )
    return false
  } catch {
    return false
  }
}
