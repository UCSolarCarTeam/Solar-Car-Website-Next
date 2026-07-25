"use server";
import { db } from "@/server/db";

export async function getPublicSponsors() {
  const sponsors = await db.sponsor.findMany({
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
}
