import {
  AccountingTeam,
  CommunicationsTeam,
  ElectricalTeam,
  MechanicalTeam,
  MultiTeam,
  SoftwareTeam,
  SponsorshipTeam,
  UpperTeamRoles,
} from "@/app/_types";
import { AllTeamRoles, type User } from "@prisma/client";
import { TRPCError } from "@trpc/server";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const feRouter = createTRPCRouter({
  getRecruitment: publicProcedure.query(async ({ ctx }) => {
    try {
      const forms = await ctx.db.recruitment.findMany({
        orderBy: {
          expiresAt: "asc",
        },
        where: {
          expiresAt: {
            gte: new Date(), // greater than or equal to the current date
          },
        },
      });
      return forms.map((form) => {
        const { description, expiresAt, header, id, link } = form;
        return {
          description,
          expiresAt,
          header,
          id,
          link,
        };
      });
    } catch (error) {
      throw new TRPCError({
        cause: error,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),

  getSponsors: publicProcedure.query(async ({ ctx }) => {
    try {
      const sponsors = await ctx.db.sponsor.findMany();
      return sponsors.map((sponsor) => {
        const { description, id, logoUrl, name, sponsorLevel, websiteUrl } =
          sponsor;
        return {
          description,
          logoUrl,
          name,
          sponsorLevel,
          websiteUrl,
        };
      });
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
});
