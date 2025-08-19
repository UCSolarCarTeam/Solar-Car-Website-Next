import { z } from "zod";

import { UpperTeamRoles } from "@/app/_types";
import {
  adminMiddleware,
  authedProcedure,
  createTRPCRouter,
} from "@/server/api/trpc";
import { AllTeamRoles, SponsorLevel } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export type UserRole =
  | "admin"
  | "business"
  | "mechanicallead"
  | "electricallead"
  | "member";

export type AdminRoles = Exclude<UserRole, "member">;

const UserRoleSchema = z.enum([
  "admin",
  "business",
  "mechanicallead",
  "electricallead",
  "member",
]);

export const portalRouter = createTRPCRouter({
  createRecruitmentForm: adminMiddleware
    .input(
      z.object({
        description: z.string(),
        expiresAt: z.string(),
        header: z.string(),
        link: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.recruitment.create({
          data: {
            description: input.description,
            expiresAt: input.expiresAt,
            header: input.header,
            link: input.link,
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

  deleteClerkUser: adminMiddleware
    .input(z.object({ clerkId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.clerkClient.users.deleteUser(input.clerkId);
        return true;
      } catch (error) {
        throw new TRPCError({
          cause: error,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),

  deleteDBUser: adminMiddleware
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.user.delete({
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

  deleteRecruitmentForm: adminMiddleware
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.recruitment.delete({
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

  deleteSponsor: adminMiddleware
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.sponsor.delete({
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

  getClerkUsers: adminMiddleware.query(async ({ ctx }) => {
    try {
      const users = await ctx.clerkClient.users.getUserList({
        limit: 500,
      });

      return users.data
        .sort((a, b) => {
          // Sort users with null role to the beginning
          if (
            a.publicMetadata?.role === null ||
            a.publicMetadata?.role === undefined
          )
            return -1;
          if (
            b.publicMetadata?.role === null ||
            b.publicMetadata?.role === undefined
          )
            return 1;
          return 0;
        })
        .map((user) => ({
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

  getFormsList: adminMiddleware.query(async ({ ctx }) => {
    try {
      const forms = await ctx.db.recruitment.findMany();
      return forms;
    } catch (error) {
      throw new TRPCError({
        cause: error,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  getInvitedUsers: adminMiddleware.query(async ({ ctx }) => {
    try {
      const invitations = await ctx.clerkClient.invitations.getInvitationList({
        limit: 500,
      });

      return invitations.data.map((invitation) => ({
        createdAt: invitation.createdAt,
        email: invitation.emailAddress,
        id: invitation.id,
        status: invitation.status,
      }));
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

  inviteUser: adminMiddleware
    .input(
      z.object({ email: z.string().email(), selectedRole: UserRoleSchema }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.clerkClient.invitations.createInvitation({
          emailAddress: input.email,
          publicMetadata: {
            role: input.selectedRole,
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

  revokeUserInvitation: adminMiddleware
    .input(z.object({ invitationId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.clerkClient.invitations.revokeInvitation(input.invitationId);
        return true;
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

  updateRecruitmentForm: adminMiddleware
    .input(
      z.object({
        description: z.string().nullable(),
        expiresAt: z.string().nullable(),
        header: z.string().nullable(),
        id: z.number(),
        link: z.string().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // only update the fields that are non null
        const updateData = {
          description: input.description,
          expiresAt: input.expiresAt,
          header: input.header,
          link: input.link,
        };
        const filteredUpdateData = Object.fromEntries(
          Object.entries(updateData).filter(([_, value]) => value !== null),
        );

        await ctx.db.recruitment.update({
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
