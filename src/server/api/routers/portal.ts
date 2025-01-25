import { z } from "zod";

import {
  adminMiddleware,
  authedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { UpperTeamRoles } from "@/types";
import { AllTeamRoles } from "@prisma/client";
import { TRPCError } from "@trpc/server";

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
        teamRole: z.nativeEnum(AllTeamRoles).nullable(),
        yearJoined: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user.userId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated.",
          });
        }

        const user = await ctx.clerkClient.users.getUser(ctx.user.userId);
        const isUpperTeamRole = Object.values(UpperTeamRoles).includes(
          input.teamRole as UpperTeamRoles,
        );

        if (isUpperTeamRole && user.publicMetadata?.role !== "admin") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be an admin to assign this role.",
          });
        }

        // Update the user regardless of whether the role is an UpperTeamRole or not
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

        return true;
      } catch (error) {
        return false;
      }
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
