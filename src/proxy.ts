import { precompute } from "flags/next";
import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

import { recruitmentFlags } from "./flags";

// ignore the '/api/webhooks(.*)' route
const isPublicRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/",
  "/recruitment",
  "/recruitment/(.*)",
  "/cars",
  "/team",
  "/support-us",
  "/sponsors",
  "/contact",
  "/our-work",
]);
const isFeatureRoute = createRouteMatcher([
  "/recruitment",
  "/recruitment/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
  if (isFeatureRoute(req)) {
    const code = await precompute(recruitmentFlags);
    const nextUrl = new URL(
      `${req.nextUrl.pathname}/${code}${req.nextUrl.search}`,
      req.url,
    );
    return NextResponse.rewrite(nextUrl, { request: req });
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
