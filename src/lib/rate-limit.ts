const WINDOW_SEC = 600
const LIMIT = 5

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
 * Per-IP sliding window using the Worker Cache API. Fails open if Cache is
 * unavailable (local Node prerender, missing caches).
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
    const count = existing === undefined ? 0 : Number(await existing.text())
    if (!Number.isFinite(count) || count >= LIMIT) {
      return count >= LIMIT
    }

    await cache.put(
      key,
      new Response(String(count + 1), {
        headers: { 'Cache-Control': `max-age=${WINDOW_SEC}` },
      }),
    )
    return false
  } catch {
    return false
  }
}
