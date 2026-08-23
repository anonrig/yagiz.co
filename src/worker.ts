import { handle } from '@astrojs/cloudflare/handler'
import {
  appendLink,
  appendVaryAccept,
  isImmutableAsset,
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

const PAGE_CDN_CACHE = 'public, max-age=3600, stale-while-revalidate=86400'
const ASSET_CDN_CACHE = 'public, max-age=31536000, immutable'

function applyCdnCache(request: Request, response: Response): Response {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return response
  }
  if (response.status !== 200) {
    return response
  }

  const pathname = new URL(request.url).pathname
  if (pathname.startsWith('/api/')) {
    return response
  }

  return withHeaders(response, (headers) => {
    if (headers.has('Cloudflare-CDN-Cache-Control')) {
      return
    }
    const isAsset = isImmutableAsset(pathname)
    headers.set('Cloudflare-CDN-Cache-Control', isAsset ? ASSET_CDN_CACHE : PAGE_CDN_CACHE)
    if (!headers.has('Cache-Tag')) {
      headers.set('Cache-Tag', isAsset ? 'asset' : 'page')
    }
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
      return applyCdnCache(request, await handle(request, env, ctx))
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
        return applyCdnCache(
          request,
          withHeaders(mdResponse, (headers) => {
            headers.set('Content-Type', 'text/markdown; charset=utf-8')
            appendVaryAccept(headers)
            appendLink(
              headers,
              `<${url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '') || '/'}>; rel="canonical"`,
            )
          }),
        )
      }

      if (!preferredType(accept, ['text/html'])) {
        return notAcceptable(
          'Not Acceptable\n\nMarkdown sibling missing and HTML is not acceptable.\n',
        )
      }
    }

    const response = await handle(request, env, ctx)
    return applyCdnCache(
      request,
      withHeaders(response, (headers) => {
        appendVaryAccept(headers)
        if (headers.get('content-type')?.includes('text/html')) {
          appendLink(headers, `<${mdPath}>; rel="alternate"; type="text/markdown"`)
        }
      }),
    )
  },
} satisfies ExportedHandler<Env>
