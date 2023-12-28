import * as Sentry from "@sentry/astro";
import { ProfilingIntegration } from "@sentry/profiling-node";
import { SENTRY_DSN } from "../constants";

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
  debug: false,
  integrations: [new ProfilingIntegration()],
});
