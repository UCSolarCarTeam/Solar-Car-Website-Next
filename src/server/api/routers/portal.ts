import { z } from "zod";

import {
  adminMiddleware,
  authedProcedure,
  createTRPCRouter,
} from "@/server/api/trpc";

export type UserRole = "admin" | "mechanical" | "business" | "member";
const UserRoleSchema = z.enum(["admin", "mechanical", "business", "member"]);

export const portalRouter = createTRPCRouter({
  getClerkUsers: authedProcedure.query(async ({ ctx }) => {
    const users = await ctx.clerkClient.users.getUserList();

    return users.data.map((user) => ({
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      id: user.id,
      imageUrl: user.hasImage ? user.imageUrl : undefined,
      lastName: user.lastName,
      publicMetadata: user.publicMetadata,
      role: user.publicMetadata?.role,
      username: user.username,
    }));
  }),
  getDBUsers: authedProcedure.query(async ({ ctx }) => {
    const users = await ctx.db.user.findMany();
    return users;
  }),

  updateUserRole: adminMiddleware
    .input(
      z.object({
        role: UserRoleSchema,
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.userId) {
        await ctx.clerkClient.users.updateUserMetadata(input.userId, {
          publicMetadata: {
            role: input.role,
          },
        });
      }
      return true;
    }),
});
