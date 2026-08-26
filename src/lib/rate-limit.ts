const WINDOW_SEC = 600
const LIMIT = 5

function clientIp(request: Request): string {
  return request.headers.get('cf-connecting-ip') ?? request.headers.get('x-forwarded-for') ?? 'local'
}

/**
 * Per-IP sliding window using the Worker Cache API. Fails open if Cache is
 * unavailable (local Node prerender, missing caches).
 */
export async function isRateLimited(request: Request, bucket: string): Promise<boolean> {
  const ip = clientIp(request)
  const key = new Request(`https://rl.yagiz.co/${bucket}/${ip}`)

  try {
    const existing = await caches.default.match(key)
    const count = existing === undefined ? 0 : Number(await existing.text())
    if (!Number.isFinite(count) || count >= LIMIT) {
      return count >= LIMIT
    }

    await caches.default.put(
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
