import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'

import {
  isEmail,
  isHoneypot,
  jsonResponse,
  readJsonObject,
  readString,
  validateName,
} from '@/lib/form-api'
import { isRateLimited } from '@/lib/rate-limit'

export const POST: APIRoute = async ({ request }) => {
  const body = await readJsonObject(request)
  if (body === null) {
    return jsonResponse(400, 'Invalid JSON body.')
  }

  if (isHoneypot(readString(body, 'company'))) {
    return jsonResponse(200, 'Added you to the newsletter. Thank you for signing up.')
  }

  if (await isRateLimited(request, 'newsletter')) {
    return jsonResponse(429, 'Too many requests. Please try again later.')
  }

  const email = readString(body, 'email')
  const name = readString(body, 'name')

  if (!isEmail(email) || !validateName(name)) {
    return jsonResponse(400, 'Input validation failed. Make sure you have an email and a full name')
  }

  try {
    await env.newsletter
      .prepare('INSERT INTO subscribers (email, name) VALUES (?, ?) ON CONFLICT (email) DO NOTHING')
      .bind(email, name)
      .run()
  } catch (error) {
    console.error('Failed to insert subscriber into D1:', error)
    return jsonResponse(500, 'Failed to register. Please try again.')
  }

  return jsonResponse(200, 'Added you to the newsletter. Thank you for signing up.')
}

export const prerender = false
