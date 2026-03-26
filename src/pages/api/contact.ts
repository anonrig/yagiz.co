import { env } from 'cloudflare:workers'
import type { APIRoute } from 'astro'

const response = ({ status, message }: { status: number; message: string }) =>
  new Response(JSON.stringify({ status, message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

export const POST: APIRoute = async ({ request }) => {
  const body: {
    email?: string
    subject?: string
    message?: string
  } = await request.json()

  if (!body.email?.length || !body.subject?.length || !body.message?.length) {
    return response({
      status: 400,
      message: 'Input validation failed. Email, subject, and message are required.',
    })
  }

  try {
    await env.email.send({
      to: 'yagiz@nizipli.com',
      from: 'contact@newsletter.yagiz.co',
      replyTo: body.email,
      subject: body.subject,
      text: `From: ${body.email}\n\n${body.message}`,
      html: `<p><strong>From:</strong> ${body.email}</p><br><p>${body.message.replaceAll('\n', '<br>')}</p>`,
    })
  } catch (err) {
    console.error('Failed to send contact email:', err)
    return response({ status: 500, message: 'Failed to send message. Please try again.' })
  }

  return response({ status: 200, message: 'Message sent.' })
}

export const prerender = false
