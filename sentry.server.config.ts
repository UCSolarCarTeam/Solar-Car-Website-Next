import * as Sentry from "@sentry/nextjs";

const serverTracesSampleRate = Number.parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.1");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: Number.isNaN(serverTracesSampleRate) ? 0.1 : serverTracesSampleRate,
});
