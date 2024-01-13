const { withContentlayer } = require('next-contentlayer')
const { withSentryConfig } = require('@sentry/nextjs')

const plugins = [withContentlayer]

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  redirects() {
    return [{ source: '/rss.xml', destination: '/rss', permanent: true }]
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: 'i3.ytimg.com' }],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
    serverComponentsExternalPackages: ['@sentry/profiling-node'],
  },
  transpilePackages: ['lucide-react', 'date-fns'],
}

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
    tunnelRoute: '/api/elroy',
    hideSourceMaps: true,
    disableLogger: true,
    autoInstrumentAppDirectory: true,
    autoInstrumentMiddleware: true,
    autoInstrumentServerFunctions: true,
  },
)
