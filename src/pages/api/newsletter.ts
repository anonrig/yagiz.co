import type { APIRoute } from 'astro'
import { env } from 'cloudflare:workers'

const response = ({ status, message }: { status: number; message: string }): Response =>
  Response.json(
    { status, message },
    {
      status,
      headers: { 'Content-Type': 'application/json' },
    },
  )

export const POST: APIRoute = async ({ request }) => {
  const body: { email?: string; name?: string } = await request.json()

  if (!body.email?.length || !body.name?.length) {
    return response({
      status: 400,
      message: 'Input validation failed. Make sure you have an email and a full name',
    })
  }

  try {
    await env.newsletter
      .prepare('INSERT INTO subscribers (email, name) VALUES (?, ?) ON CONFLICT (email) DO NOTHING')
      .bind(body.email, body.name)
      .run()
  } catch (error) {
    console.error('Failed to insert subscriber into D1:', error)
    return response({ status: 500, message: 'Failed to register. Please try again.' })
  }

  return response({
    status: 200,
    message: 'Added you to the newsletter. Thank you for signing up.',
  })
}

export const prerender = false
