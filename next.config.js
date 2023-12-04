const { withContentlayer } = require('next-contentlayer')
const { withSentryConfig } = require('@sentry/nextjs')

const plugins = [withContentlayer]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  redirects() {
    return [{ source: '/rss.xml', destination: '/rss', permanent: true }]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
}

const securityHeaders = [
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

module.exports = withSentryConfig(
  plugins.reduce((acc, next) => next(acc), nextConfig),
  {
    silent: true,
    org: 'yagiz-nb',
    project: 'yagiz-co',
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: false,
    tunnelRoute: '/elroy',
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  },
)
