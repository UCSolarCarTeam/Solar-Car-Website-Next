import * as Sentry from "@sentry/nextjs";

const parsedClientTracesSampleRate = Number.parseFloat(
  process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0.1",
);

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: process.env.NODE_ENV === "production",
  tracesSampleRate: Number.isNaN(parsedClientTracesSampleRate) ? 0.1 : parsedClientTracesSampleRate,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
