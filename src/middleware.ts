import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ignore the '/api/webhooks(.*)' route
const isPublicRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/api/trpc/fe.getTeamMembers(.*)",
  "/api/trpc/fe.getSponsors(.*)",
  "/api/trpc/fe.getRecruitment(.*)",
  "/api/trpc/fe.getOurWork(.*)",
  "/api/chat",
  "/",
  "/recruitment",
  "/cars",
  "/team",
  "/support-us",
  "/sponsors",
  "/contact",
  "/our-work",
]);

const chatRateLimit = new Map<string, { count: number; lastReset: number }>();

export default clerkMiddleware(async (auth, req) => {
  // Rate limiting for chat API
  if (req.nextUrl.pathname === "/api/chat" && req.method === "POST") {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const now = Date.now();
    const windowMs = 60000; // 1 minute
    const maxRequests = 10;

    const entry = chatRateLimit.get(ip) ?? { count: 0, lastReset: now };

    if (now - entry.lastReset > windowMs) {
      entry.count = 0;
      entry.lastReset = now;
    }

    entry.count += 1;
    chatRateLimit.set(ip, entry);

    if (entry.count > maxRequests) {
      return new Response("Too Many Requests", { status: 429 });
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
