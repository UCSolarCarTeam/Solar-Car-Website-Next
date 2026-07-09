import { AllTeamRoles, type User } from "@prisma/client";
import {
  AccountingTeam,
  CommunicationsTeam,
  ElectricalTeam,
  LeadRoles,
  ManagerRoles,
  MechanicalTeam,
  MultiTeam,
  SoftwareTeam,
  SponsorshipTeam,
} from "@/app/_types";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const feRouter = createTRPCRouter({
  getAlumni: publicProcedure.query(getPublicAlumni),
  getRecruitment: publicProcedure.query(async ({ ctx }) => {
    const forms = await ctx.db.recruitment.findMany({
      orderBy: {
        expiresAt: "asc",
      },
      where: {
        deletedAt: null,
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
  }),

  getSponsors: publicProcedure.query(async ({ ctx }) => {
    const sponsors = await ctx.db.sponsor.findMany({
      where: {
        deletedAt: null,
      },
    });
    return sponsors.map((sponsor) => {
      const { description, logoUrl, name, sponsorLevel, websiteUrl } = sponsor;
      return {
        description,
        logoUrl,
        name,
        sponsorLevel,
        websiteUrl,
      };
    });
  }),

  getTeamMembers: publicProcedure.query(getPublicTeamMembers),
});
