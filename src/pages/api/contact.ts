import type { APIRoute } from 'astro'

import { env } from 'cloudflare:workers'

import {
  escapeHtml,
  isEmail,
  isHoneypot,
  jsonResponse,
  oneLine,
  readJsonObject,
  readString,
  validateMessage,
  validateSubject,
} from '@/lib/form-api'
import { isRateLimited } from '@/lib/rate-limit'

export const POST: APIRoute = async ({ request }) => {
  const body = await readJsonObject(request)
  if (body === null) {
    return jsonResponse(400, 'Invalid JSON body.')
  }

  if (isHoneypot(readString(body, 'company'))) {
    return jsonResponse(200, 'Message sent.')
  }

  if (await isRateLimited(request, 'contact')) {
    return jsonResponse(429, 'Too many requests. Please try again later.')
  }

  const email = readString(body, 'email')
  const subject = oneLine(readString(body, 'subject'))
  const message = readString(body, 'message')

  if (!isEmail(email) || !validateSubject(subject) || !validateMessage(message)) {
    return jsonResponse(
      400,
      'Input validation failed. Email, subject, and message are required.',
    )
  }

  const safeEmail = escapeHtml(email)
  const safeMessage = escapeHtml(message).replaceAll('\n', '<br>')

  try {
    await env.email.send({
      to: 'yagiz@nizipli.com',
      from: 'contact@newsletter.yagiz.co',
      replyTo: email,
      subject,
      text: `From: ${email}\n\n${message}`,
      html: `<p><strong>From:</strong> ${safeEmail}</p><br><p>${safeMessage}</p>`,
    })
  } catch (error) {
    console.error('Failed to send contact email:', error)
    return jsonResponse(500, 'Failed to send message. Please try again.')
  }

  return jsonResponse(200, 'Message sent.')
}

export const prerender = false
