import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { precompute } from "flags/next";
import { NextResponse } from "next/server";
import { recruitmentFlags } from "@/flags";

// ignore the '/api/webhooks(.*)' route
const isPublicRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/api/trpc/fe.getTeamMembers(.*)",
  "/api/trpc/fe.getSponsors(.*)",
  "/api/trpc/fe.getRecruitment(.*)",
  "/",
  "/recruitment(.*)",
  "/cars",
  "/team",
  "/support-us",
  "/sponsors",
  "/our-work",
  "/portal/sign-in(.*)",
  "/portal/sign-up(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }

  if (req.nextUrl.pathname === "/recruitment") {
    const code = await precompute(recruitmentFlags);
    const destination = req.nextUrl.clone();
    destination.pathname = `/recruitment/${code}`;

    return NextResponse.rewrite(destination);
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
