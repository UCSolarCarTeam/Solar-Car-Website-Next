"use server";

import { db } from "@/server/db";

export const getRecruitmentForms = async () =>
  await db.recruitment.findMany({
    orderBy: {
      expiresAt: "asc",
    },
    select: {
      description: true,
      header: true,
      id: true,
      link: true,
    },
    where: {
      deletedAt: null,
      expiresAt: {
        gte: new Date(),
      },
    },
  });
