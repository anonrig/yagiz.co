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
    // With performance monitoring, Sentry tracks your software performance,
    // measuring metrics like throughput and latency, and displays the impact
    // of errors across multiple systems.
    new Sentry.BrowserTracing(),
    // Enables session replay.
    new Sentry.Replay({
      maskAllText: false,
    }),
    new Sentry.BrowserProfilingIntegration(),
    new Sentry.Feedback({
      colorScheme: 'system',
      autoInject: true,
      buttonLabel: 'Share Feedback',
      formTitle: 'Share Feedback',
      messagePlaceholder: 'What feedback do you have?',
      submitButtonLabel: 'Submit Feedback',
    }),
  ],
  allowUrls: ['https://www.yagiz.co', 'https://yagiz.co'],
  profilesSampleRate: 1.0,
})
