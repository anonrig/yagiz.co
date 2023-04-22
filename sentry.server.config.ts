import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  autoSessionTracking: SENTRY_DSN !== undefined,
  dsn: SENTRY_DSN ?? '',
  tracesSampleRate: 1.0,
});
