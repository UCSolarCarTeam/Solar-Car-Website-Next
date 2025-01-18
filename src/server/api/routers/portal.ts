import { z } from "zod";

import {
  adminMiddleware,
  authedProcedure,
  createTRPCRouter,
  publicProcedure,
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

  getTeamMembers: publicProcedure.query(async ({ ctx }) => {
    const dbUsers = await ctx.db.user.findMany();
    const teamMembers = dbUsers.map((user) => {
      const { clerkUserId, id, ...rest } = user;
      return rest;
    });
    return teamMembers.filter(
      (teamMember) =>
        teamMember.firstName !== null || teamMember.firstName === "",
    );
  }),

  updateDBUser: authedProcedure
    .input(
      z.object({
        description: z.string().nullable(),
        fieldOfStudy: z.string().nullable(),
        firstName: z.string().nullable(),
        id: z.number(),
        lastName: z.string().nullable(),
        profilePictureUrl: z.string().nullable(),
        schoolYear: z.string().nullable(),
        teamRole: z.string().nullable(),
        yearJoined: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.update({
          data: {
            description: input.description,
            fieldOfStudy: input.fieldOfStudy,
            firstName: input.firstName,
            lastName: input.lastName,
            profilePictureUrl: input.profilePictureUrl,
            schoolYear: input.schoolYear,
            teamRole: input.teamRole,
            yearJoined: input.yearJoined,
          },
          where: { id: input.id },
        });
      } catch (error) {
        console.error(error);
        return false;
      }
      return true;
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
