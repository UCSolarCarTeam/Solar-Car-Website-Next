import { type NextRequest, NextResponse } from "next/server";

// Proxy/tunnel route for Sentry client telemetry. The SDK will POST envelopes
// to this path when `tunnelRoute` is configured in next.config.js. This
// implementation forwards the raw envelope to the Sentry ingest endpoint using
// the server DSN configured in SENTRY_DSN.
export async function POST(req: NextRequest) {
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    return NextResponse.json(
      { error: "SENTRY_DSN not configured" },
      { status: 500 },
    );
  }

  // DSN expected like: https://<publicKey>@o4511409386160128.ingest.us.sentry.io/4511409391665152
  const m = /^https?:\/\/([^@]+)@([^/]+)\/(\d+)(?:\/.*)?$/.exec(dsn);
  if (!m) {
    return NextResponse.json({ error: "Invalid SENTRY_DSN" }, { status: 500 });
  }

  const [, publicKey, host, projectId] = m;
  const target = `https://${host}/api/${projectId}/envelope/?sentry_key=${publicKey}`;

  try {
    const body = await req.arrayBuffer();
    const contentType =
      req.headers.get("content-type") ?? "application/octet-stream";

    const forwardRes = await fetch(target, {
      body,
      headers: {
        "content-type": contentType,
      },
      method: "POST",
    });

    const text = await forwardRes.text();
    return new NextResponse(text, { status: forwardRes.status });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to proxy to Sentry" },
      { status: 502 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
