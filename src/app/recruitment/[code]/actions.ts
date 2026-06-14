"use server";

import { db } from "@/server/db";

export type RecruitmentForm = {
  description: string;
  expiresAt: Date;
  header: string;
  id: number;
  link: string;
};

export async function getRecruitmentForms(): Promise<RecruitmentForm[]> {
  const forms = await db.recruitment.findMany({
    orderBy: {
      expiresAt: "asc",
    },
    select: {
      description: true,
      expiresAt: true,
      header: true,
      id: true,
      link: true,
    },
    where: {
      expiresAt: {
        gte: new Date(),
      },
    },
  });

  return forms;
}
