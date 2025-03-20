import { z } from "zod";

import { UpperTeamRoles } from "@/app/_types";
import {
  adminMiddleware,
  authedProcedure,
  createTRPCRouter,
} from "@/server/api/trpc";
import { AllTeamRoles, SponsorLevel } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export type UserRole = "admin" | "mechanical" | "business" | "member";
const UserRoleSchema = z.enum(["admin", "mechanical", "business", "member"]);

export const portalRouter = createTRPCRouter({
  createSponsor: adminMiddleware
    .input(
      z.object({
        description: z.string().nullable(),
        logoUrl: z.string(),
        name: z.string(),
        sponsorLevel: z.nativeEnum(SponsorLevel),
        websiteUrl: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.sponsor.create({
          data: {
            description: input.description,
            logoUrl: input.logoUrl,
            name: input.name,
            sponsorLevel: input.sponsorLevel,
            websiteUrl: input.websiteUrl,
          },
        });
        return true;
      } catch (error) {
        throw new TRPCError({
          cause: error,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  deleteSponsor: adminMiddleware
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.sponsor.delete({
          where: {
            id: input,
          },
        });
        return true;
      } catch (error) {
        throw new TRPCError({
          cause: error,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  getClerkUsers: adminMiddleware.query(async ({ ctx }) => {
    try {
      const users = await ctx.clerkClient.users.getUserList({
        limit: 500,
      });

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
    } catch (error) {
      throw new TRPCError({
        cause: error,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  getCurrentDBUser: authedProcedure.query(async ({ ctx }) => {
    try {
      const user = await ctx.db.user.findUnique({
        where: {
          clerkUserId: ctx.user?.id,
        },
      });
      return user;
    } catch (error) {
      throw new TRPCError({
        cause: error,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  getDBUsers: adminMiddleware.query(async ({ ctx }) => {
    try {
      const users = await ctx.db.user.findMany({ orderBy: { id: "desc" } });
      return users;
    } catch (error) {
      throw new TRPCError({
        cause: error,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  getSponsorsList: adminMiddleware.query(async ({ ctx }) => {
    try {
      const sponsors = await ctx.db.sponsor.findMany();
      return sponsors;
    } catch (error) {
      throw new TRPCError({
        cause: error,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  updateDBUser: authedProcedure
    .input(
      z.object({
        description: z.string().nullable(),
        fieldOfStudy: z.string().nullable(),
        firstName: z.string().nullable(),
        id: z.number(),
        lastName: z.string().nullable(),
        phoneNumber: z.string().nullable(),
        profilePictureUrl: z.string().nullable(),
        schoolEmail: z.string().nullable(),
        schoolYear: z.string().nullable(),
        teamRole: z.nativeEnum(AllTeamRoles).nullable(),
        ucid: z.number().nullable(),
        yearJoined: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (!ctx.user?.id) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User not authenticated.",
          });
        }

        const user = await ctx.clerkClient.users.getUser(ctx.user?.id);
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
            phoneNumber: input.phoneNumber,
            profilePictureUrl: input.profilePictureUrl,
            schoolEmail: input.schoolEmail,
            schoolYear: input.schoolYear,
            teamRole: input.teamRole,
            ucid: Number(input.ucid),
            yearJoined: input.yearJoined,
          },
          where: { id: input.id },
        });

        return true;
      } catch (error) {
        throw new TRPCError({
          cause: error,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  updateSponsor: adminMiddleware
    .input(
      z.object({
        description: z.string().nullable(),
        id: z.number(),
        logoUrl: z.string().nullable(),
        name: z.string().nullable(),
        sponsorLevel: z.nativeEnum(SponsorLevel),
        websiteUrl: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // only update the fields that are non null
        const updateData = {
          description: input.description,
          logoUrl: input.logoUrl,
          name: input.name,
          sponsorLevel: input.sponsorLevel,
          websiteUrl: input.websiteUrl,
        };
        const filteredUpdateData = Object.fromEntries(
          Object.entries(updateData).filter(([_, value]) => value !== null),
        );

        await ctx.db.sponsor.update({
          data: filteredUpdateData,
          where: {
            id: input.id,
          },
        });
        return true;
      } catch (error) {
        throw new TRPCError({
          cause: error,
          code: "INTERNAL_SERVER_ERROR",
        });
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
      try {
        if (input.userId) {
          await ctx.clerkClient.users.updateUserMetadata(input.userId, {
            publicMetadata: {
              role: input.role,
            },
          });
        }
        return true;
      } catch (error) {
        throw new TRPCError({
          cause: error,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
