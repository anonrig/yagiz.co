import type { APIRoute } from 'astro'

import {
  buildCommentThread,
  conversationSourceUrl,
  isDiscussionId,
  parseConversation,
} from '@/lib/discussion'
import { jsonResponse } from '@/lib/form-api'

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const id = url.searchParams.get('id') ?? ''
  if (!isDiscussionId(id)) {
    return jsonResponse(400, 'Invalid discussion id.')
  }

  try {
    const upstream = await fetch(conversationSourceUrl(id), {
      headers: { accept: 'application/json' },
    })
    if (!upstream.ok) {
      return jsonResponse(502, 'Could not load comments.')
    }

    const payload: unknown = await upstream.json()
    const thread = buildCommentThread(id, parseConversation(payload))
    return Response.json(thread, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    })
  } catch {
    return jsonResponse(502, 'Could not load comments.')
  }
}
