// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import { SENTRY_DSN } from './next.constants'

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1,
  debug: false,
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 1.0,
  integrations: [
    new Sentry.Dedupe(),
    new Sentry.HttpContext(),
    new Sentry.Breadcrumbs(),
    new Sentry.LinkedErrors(),
    new Sentry.Replay({
      maskAllText: false,
    }),
    new Sentry.BrowserTracing(),
  ],
  allowUrls: ['https://www.yagiz.co', 'https://yagiz.co'],
})
