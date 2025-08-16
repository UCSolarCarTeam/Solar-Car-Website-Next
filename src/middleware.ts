import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// ignore the '/api/webhooks(.*)' route
const isPublicRoute = createRouteMatcher([
  "/api/webhooks(.*)",
  "/api/trpc/fe.getTeamMembers(.*)",
  "/api/trpc/fe.getSponsors(.*)",
  "/api/trpc/fe.getRecruitment(.*)",
  "/",
  "/recruitment",
  "/cars",
  "/team",
  "/support-us",
  "/sponsors",
  "/contact",
]);

export default clerkMiddleware(async (auth, req) => {
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
