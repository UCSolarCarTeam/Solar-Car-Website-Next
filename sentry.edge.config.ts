import * as Sentry from "@sentry/nextjs";

const edgeTracesSampleRate = Number.parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.1");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: Number.isNaN(edgeTracesSampleRate) ? 0.1 : edgeTracesSampleRate,
});
