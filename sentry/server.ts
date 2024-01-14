import * as Sentry from '@sentry/astro'
import { SENTRY_DSN } from '../constants'

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
})
