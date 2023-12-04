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
  },
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports: ['lucide-react', 'date-fns'],
    serverComponentsExternalPackages: ['@sentry/profiling-node'],
  },
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
    tunnelRoute: '/elroy',
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  },
)
