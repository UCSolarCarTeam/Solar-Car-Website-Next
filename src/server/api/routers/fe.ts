import { getPublicAlumni, getPublicTeamMembers } from "@/app/team/actions";
import { getPublicSponsors } from "@/server/public/sponsors";
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

  getSponsors: publicProcedure.query(getPublicSponsors),

  getTeamMembers: publicProcedure.query(getPublicTeamMembers),
});
