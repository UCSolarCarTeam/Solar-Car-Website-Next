import type { User } from "@clerk/backend";
import { currentUser } from "@clerk/nextjs/server";
import { adminClerkRoles } from "@/app/_types";
import { clerkClient } from "@/server/api/trpc";
import { db } from "@/server/db";

import { PortalError } from "./errors";
import type { AdminRoles } from "./types";

export type PortalContext = {
  user: User | null;
  db: typeof db;
  clerkClient: typeof clerkClient;
};

export async function getPortalContext(): Promise<PortalContext> {
  const user = await currentUser();
  return { clerkClient, db, user };
}

export async function requireAuthedContext(): Promise<
  PortalContext & { user: User }
> {
  const ctx = await getPortalContext();
  if (!ctx.user) {
    throw new PortalError("Unauthorized");
  }
  return { ...ctx, user: ctx.user };
}

export async function requireAdminContext(): Promise<
  PortalContext & { user: User }
> {
  const ctx = await requireAuthedContext();
  const clerkUser = await ctx.clerkClient.users.getUser(ctx.user.id);
  if (!adminClerkRoles.includes(clerkUser.publicMetadata?.role as AdminRoles)) {
    throw new PortalError("Unauthorized");
  }
  return ctx;
}
