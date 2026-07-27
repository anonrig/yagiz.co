import { handle } from '@astrojs/cloudflare/handler'
import {
  appendLink,
  appendVaryAccept,
  markdownPath,
  preferredType,
  shouldSkipNegotiation,
} from './lib/accept'

function notAcceptable(message: string): Response {
  const response = new Response(message, {
    status: 406,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
  appendVaryAccept(response.headers)
  return response
}

function withHeaders(response: Response, mutate: (headers: Headers) => void): Response {
  const headers = new Headers(response.headers)
  mutate(headers)
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

async function assetsFetch(env: Env, request: Request, pathname: string): Promise<Response> {
  const url = new URL(request.url)
  url.pathname = pathname
  return env.ASSETS.fetch(new Request(url.toString(), request))
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url)

    if (shouldSkipNegotiation(url.pathname)) {
      return handle(request, env, ctx)
    }

    const accept = request.headers.get('accept')
    const chosen = preferredType(accept, ['text/html', 'text/markdown'])

    if (chosen === null && accept) {
      return notAcceptable('Not Acceptable\n\nAvailable: text/html, text/markdown\n')
    }

    const mdPath = markdownPath(url.pathname)

    if (chosen === 'text/markdown') {
      const mdResponse = await assetsFetch(env, request, mdPath)
      if (mdResponse.status === 200) {
        return withHeaders(mdResponse, (headers) => {
          headers.set('Content-Type', 'text/markdown; charset=utf-8')
          appendVaryAccept(headers)
          appendLink(
            headers,
            `<${url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '') || '/'}>; rel="canonical"`,
          )
        })
      }

      if (!preferredType(accept, ['text/html'])) {
        return notAcceptable(
          'Not Acceptable\n\nMarkdown sibling missing and HTML is not acceptable.\n',
        )
      }
    }

    const response = await handle(request, env, ctx)
    return withHeaders(response, (headers) => {
      appendVaryAccept(headers)
      if (headers.get('content-type')?.includes('text/html')) {
        appendLink(headers, `<${mdPath}>; rel="alternate"; type="text/markdown"`)
      }
    })
  },
} satisfies ExportedHandler<Env>
