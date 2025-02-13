import { z } from "zod";

import {
  adminMiddleware,
  authedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import {
  AccountingTeam,
  CommunicationsTeam,
  ElectricalTeam,
  MechanicalTeam,
  MultiTeam,
  SoftwareTeam,
  SponsorshipTeam,
  UpperTeamRoles,
} from "@/types";
import { AllTeamRoles, type User } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export type UserRole = "admin" | "mechanical" | "business" | "member";
const UserRoleSchema = z.enum(["admin", "mechanical", "business", "member"]);

export const portalRouter = createTRPCRouter({
  getClerkUsers: authedProcedure.query(async ({ ctx }) => {
    try {
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
    } catch (error) {
      throw new TRPCError({
        cause: error,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  getDBUsers: authedProcedure.query(async ({ ctx }) => {
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

  getSponsorsList: authedProcedure.query(async ({ ctx }) => {
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

  getTeamMembers: publicProcedure.query(async ({ ctx }) => {
    try {
    const dbUsers = await ctx.db.user.findMany();
    const teamMembers = dbUsers
      .filter((teamMember) => teamMember.teamRole !== null)
      .filter(
        (teamMember) =>
          teamMember.firstName !== null || teamMember.firstName === "",
      );

    const filterByRole = (
      teamMembers: User[],
      roles:
        | typeof AccountingTeam
        | typeof CommunicationsTeam
        | typeof ElectricalTeam
        | typeof MechanicalTeam
        | typeof MultiTeam
        | typeof SoftwareTeam
        | typeof SponsorshipTeam,
    ) => {
      return teamMembers.filter((teamMember) =>
        // we can assume that we filtered out null teamRoles already
        Object.keys(roles).includes(teamMember.teamRole!),
      );
    };

    const teamCaptain =
      teamMembers.find(
        (teamMember) => teamMember.teamRole === AllTeamRoles.TeamCaptain,
      ) ?? null;
    const engineeringTeamManager =
      teamMembers.find(
        (teamMember) =>
          teamMember.teamRole === AllTeamRoles.EngineeringTeamManager,
      ) ?? null;
    const businessTeamManager =
      teamMembers.find(
        (teamMember) =>
          teamMember.teamRole === AllTeamRoles.BusinessTeamManager,
      ) ?? null;

    const leadRoles = teamMembers
      .filter(
        (teamMember) =>
            teamMember.teamRole !== null &&
            teamMember.teamRole in UpperTeamRoles,
      )
      .filter(
        (teamMember) =>
          teamMember !== teamCaptain &&
          teamMember !== engineeringTeamManager &&
          teamMember !== businessTeamManager,
      );

    const accountingTeam = filterByRole(teamMembers, AccountingTeam);
    const commmunicationsTeam = filterByRole(teamMembers, CommunicationsTeam);
    const sponsorshipTeam = filterByRole(teamMembers, SponsorshipTeam);
    const softwareTeam = filterByRole(teamMembers, SoftwareTeam);
    const electricalTeam = filterByRole(teamMembers, ElectricalTeam);
    const mechanicalTeam = filterByRole(teamMembers, MechanicalTeam);
    const multiTeam = filterByRole(teamMembers, MultiTeam);

    return {
      accountingTeam,
      businessTeamManager,
      commmunicationsTeam,
      electricalTeam,
      engineeringTeamManager,
      leadRoles,
      mechanicalTeam,
      multiTeam,
      softwareTeam,
      sponsorshipTeam,
      teamCaptain,
    };
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
