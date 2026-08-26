const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u
const EMAIL_MAX = 254
const NAME_MAX = 200
const SUBJECT_MAX = 200
const MESSAGE_MAX = 10_000

export function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

export function oneLine(value: string): string {
  return value.replaceAll(/[\r\n\0]/gu, ' ').trim()
}

export function isEmail(value: string): boolean {
  return value.length >= 6 && value.length <= EMAIL_MAX && EMAIL_RE.test(value) && !value.includes('..')
}

export function isHoneypot(value: string): boolean {
  return value.length > 0
}

export function jsonResponse(status: number, message: string): Response {
  return Response.json(
    { status, message },
    {
      status,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store',
      },
    },
  )
}

export async function readJsonObject(request: Request): Promise<Record<string, unknown> | null> {
  try {
    const body: unknown = await request.json()
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return null
    }
    return body
  } catch {
    return null
  }
}

export function readString(body: Record<string, unknown>, key: string): string {
  const value = body[key]
  return typeof value === 'string' ? value.trim() : ''
}

export function validateName(value: string): boolean {
  return value.length >= 2 && value.length <= NAME_MAX
}

export function validateSubject(value: string): boolean {
  return value.length >= 5 && value.length <= SUBJECT_MAX
}

export function validateMessage(value: string): boolean {
  return value.length >= 20 && value.length <= MESSAGE_MAX
}
