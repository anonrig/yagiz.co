import type { APIRoute } from 'astro'

import { isDiscussionId, loadDiscussion } from '@/lib/discussion'
import { jsonResponse } from '@/lib/form-api'

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id') ?? ''
  if (!isDiscussionId(id)) {
    return jsonResponse(400, 'Invalid discussion id.')
  }

  try {
    const thread = await loadDiscussion(id)
    return Response.json(thread, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch (error) {
    console.error('Failed to load discussion:', error)
    return jsonResponse(502, 'Could not load comments.')
  }
}
