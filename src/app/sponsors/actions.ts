"use server";

import { db } from "@/server/db";
import { type SponsorLevel } from "@prisma/client";

export type SponsorCard = {
  description: string | null;
  logoUrl: string;
  name: string;
  sponsorLevel: SponsorLevel;
  websiteUrl: string;
};

export async function getSponsors(): Promise<SponsorCard[]> {
  const sponsors = await db.sponsor.findMany({
    select: {
      description: true,
      logoUrl: true,
      name: true,
      sponsorLevel: true,
      websiteUrl: true,
    },
  });

  return sponsors;
}
