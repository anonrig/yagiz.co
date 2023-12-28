import * as Sentry from "@sentry/astro";
import { SENTRY_DSN } from "../constants";

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
  allowUrls: ["https://www.yagiz.co", "https://yagiz.co"],
});
