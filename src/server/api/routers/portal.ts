import { z } from "zod";

import { LeadRoles, ManagerRoles } from "@/app/_types";
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

// Server-side parser/normalizer for date inputs (accepts Date, YYYY or YYYY-MM-DD strings)
// Returns a Date set to UTC midnight or null if input is falsy/invalid
const parseAndNormalizeDate = (val: unknown): Date | null => {
  if (val === null || val === undefined || val === "") return null;

  if (val instanceof Date) {
    // Normalize to UTC midnight
    return new Date(
      Date.UTC(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate()),
    );
  }

  if (typeof val === "string") {
    const s = val.trim();
    // Year-only (YYYY)
    if (/^\d{4}$/.test(s)) {
      const y = Number(s);
      return new Date(Date.UTC(y, 0, 1));
    }

    // Full ISO-like date YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const [yStr, mStr, dStr] = s.split("-");
      const y = Number(yStr);
      const m = Number(mStr);
      const d = Number(dStr);
      const dt = new Date(Date.UTC(y, m - 1, d));
      // Validate round-trip to catch invalid dates like 2026-02-30
      if (
        dt.getUTCFullYear() === y &&
        dt.getUTCMonth() === m - 1 &&
        dt.getUTCDate() === d
      ) {
        return dt;
      }
      return null;
    }
  }

  return null;
};

export const portalRouter = createTRPCRouter({
  createAlumni: adminMiddleware
    .input(
      z.object({
        company: z.string().nullable(),
        companyTitle: z.string().nullable(),
        firstName: z.string(),
        lastName: z.string(),
        linkedIn: z.string().nullable(),
        profilePictureUrl: z.string().nullable(),
        teamRole: z.nativeEnum(AllTeamRoles).nullable(),
        yearJoined: z.preprocess((v) => parseAndNormalizeDate(v), z.date()),
        yearRetired: z.preprocess((v) => parseAndNormalizeDate(v), z.date()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.create({
          data: {
            company: input.company ?? null,
            companyTitle: input.companyTitle ?? null,
            firstName: input.firstName,
            lastName: input.lastName,
            linkedIn: input.linkedIn ?? null,
            profilePictureUrl: input.profilePictureUrl ?? null,
            teamRole: input.teamRole ?? null,
            yearJoined: input.yearJoined as Date | null,
            yearRetired: input.yearRetired as Date | null,
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
  createOurWorkEntry: adminMiddleware
    .input(
      z.object({
        description: z.string().nullable(),
        imageUrl: z.string().nullable(),
        monthName: z.string(),
        monthNum: z.number(),
        year: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.timeline.create({
          data: {
            description: input.description,
            imageUrl: input.imageUrl,
            monthName: input.monthName,
            monthNum: input.monthNum,
            year: input.year,
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
        await ctx.db.user.update({
          data: {
            deletedAt: new Date(),
            modifiedBy: ctx.user?.id,
          },
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

  deleteOurWorkEntry: adminMiddleware
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.timeline.update({
        data: {
          deletedAt: new Date(),
          modifiedBy: ctx.user?.id,
        },
        where: {
          id: input.id,
        },
      });
      return true;
    }),

  deleteRecruitmentForm: adminMiddleware
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.recruitment.update({
        data: {
          deletedAt: new Date(),
          modifiedBy: ctx.user?.id,
        },
        where: {
          id: input.id,
        },
      });
      return true;
    }),

  deleteSponsor: adminMiddleware
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.sponsor.update({
          data: {
            deletedAt: new Date(),
            modifiedBy: ctx.user?.id,
          },
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

  getAlumniList: adminMiddleware.query(async ({ ctx }) => {
    try {
      const alumni = await ctx.db.user.findMany({
        orderBy: {
          yearRetired: "desc",
        },
        where: {
          deletedAt: null,
          yearRetired: {
            not: null,
          },
        },
      });
      return alumni;
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
      return user?.deletedAt ? null : user;
    } catch (error) {
      throw new TRPCError({
        cause: error,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  getDBUsers: adminMiddleware.query(async ({ ctx }) => {
    try {
      const users = await ctx.db.user.findMany({
        orderBy: { id: "desc" },
        where: {
          deletedAt: null,
        },
      });
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
      const forms = await ctx.db.recruitment.findMany({
        where: {
          deletedAt: null,
        },
      });
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

  getOurWorkList: adminMiddleware.query(async ({ ctx }) => {
    try {
      const forms = await ctx.db.timeline.findMany({
        where: {
          deletedAt: null,
        },
      });
      return forms;
    } catch (error) {
      throw new TRPCError({
        cause: error,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  getSponsorsList: adminMiddleware.query(async ({ ctx }) => {
    try {
      const sponsors = await ctx.db.sponsor.findMany({
        where: {
          deletedAt: null,
        },
      });
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
        const existingInvitation =
          await ctx.clerkClient.invitations.getInvitationList({
            limit: 1,
            query: input.email,
          });

        if (existingInvitation.data[0]) {
          const invitation = existingInvitation.data[0];

          if ((invitation.status as string) === "pending") {
            throw new TRPCError({
              code: "CONFLICT",
              message:
                "This user has already been invited. Please remind them to check their spam",
            });
          }

          if ((invitation.status as string) === "expired") {
            try {
              await ctx.clerkClient.invitations.revokeInvitation(invitation.id);
            } catch (error) {
              throw new TRPCError({
                cause: error,
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to revoke expired invitation.",
              });
            }
          }
        }

        // if the invitation was either expired or revoked, create a new invitation
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
          message:
            "Failed to create invitation. Please contact the Telemetry Team",
        });
      }
    }),

  moveUserToAlumni: adminMiddleware
    .input(
      z.object({
        company: z.string().nullable().optional(),
        companyTitle: z.string().nullable().optional(),
        id: z.number(),
        yearRetired: z.preprocess((v) => parseAndNormalizeDate(v), z.date()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.db.$transaction(async (tx) => {
          const user = await tx.user.findUnique({
            where: {
              id: input.id,
            },
          });

          if (!user) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "User not found.",
            });
          }

          if (user.deletedAt) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Deleted users cannot be moved to alumni.",
            });
          }

          await tx.user.update({
            data: {
              company: input.company ?? undefined,
              companyTitle: input.companyTitle ?? undefined,
              yearRetired: input.yearRetired,
            },
            where: { id: input.id },
          });
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
        company: z.string().nullable(),
        companyTitle: z.string().nullable(),
        description: z.string().nullable(),
        fieldOfStudy: z.string().nullable(),
        firstName: z.string().nullable(),
        id: z.number(),
        lastName: z.string().nullable(),
        linkedIn: z.string().nullable(),
        phoneNumber: z.string().nullable(),
        profilePictureUrl: z.string().nullable(),
        schoolEmail: z.string().nullable(),
        schoolYear: z.string().nullable(),
        teamRole: z.nativeEnum(AllTeamRoles).nullable(),
        ucid: z.string().nullable(),
        yearJoined: z.preprocess((v) => {
          if (v === null || v === undefined) return null;
          return parseAndNormalizeDate(v);
        }, z.date().nullable()),
        yearRetired: z.preprocess((v) => {
          if (v === null || v === undefined) return null;
          return parseAndNormalizeDate(v);
        }, z.date().nullable()),
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
        const isUpperTeamRole =
          Object.values(ManagerRoles).includes(
            input.teamRole as ManagerRoles,
          ) || Object.values(LeadRoles).includes(input.teamRole as LeadRoles);

        if (isUpperTeamRole && user.publicMetadata?.role !== "admin") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You must be an admin to assign this role.",
          });
        }

        // Normalize any incoming year/date value to a UTC midnight Date (or null)
        const convertToDate = (val: unknown): Date | null =>
          parseAndNormalizeDate(val);

        await ctx.db.$transaction(async (tx) => {
          const user = await tx.user.findUnique({
            where: {
              id: input.id,
            },
          });

          if (!user) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "User not found.",
            });
          }

          if (user.deletedAt) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "Deleted users cannot be updated.",
            });
          }

          await tx.user.update({
            data: {
              company: input.company,
              companyTitle: input.companyTitle,
              description: input.description,
              fieldOfStudy: input.fieldOfStudy,
              firstName: input.firstName,
              lastName: input.lastName,
              linkedIn: input.linkedIn,
              phoneNumber: input.phoneNumber,
              profilePictureUrl: input.profilePictureUrl,
              schoolEmail: input.schoolEmail,
              schoolYear: input.schoolYear,
              teamRole: input.teamRole,
              ucid: input.ucid,
              yearJoined: convertToDate(input.yearJoined),
              yearRetired: convertToDate(input.yearRetired),
            },
            where: { id: input.id },
          });
        });

        return true;
      } catch (error) {
        throw new TRPCError({
          cause: error,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
  updateOurWorkEntry: adminMiddleware
    .input(
      z.object({
        description: z.string().nullable(),
        id: z.number(),
        imageUrl: z.string().nullable(),
        monthName: z.string().nullable(),
        monthNum: z.number().nullable(),
        year: z.number().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // only update the fields that are non null
        const updateData = {
          description: input.description,
          imageUrl: input.imageUrl,
          monthName: input.monthName,
          monthNum: input.monthNum,
          year: input.year,
        };
        const filteredUpdateData = Object.fromEntries(
          Object.entries(updateData).filter(([_, value]) => value !== null),
        );

        await ctx.db.timeline.update({
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
