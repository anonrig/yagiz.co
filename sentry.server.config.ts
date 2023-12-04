// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import { SENTRY_DSN } from './next.constants'
Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1,
  debug: false,
})
