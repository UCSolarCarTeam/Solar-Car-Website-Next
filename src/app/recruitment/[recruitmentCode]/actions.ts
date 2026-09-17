"use server";

import { db } from "@/server/db";
export const getRecruitment = async () => {
  const forms = await db.recruitment.findMany({
    orderBy: {
      expiresAt: "asc",
    },
    where: {
      deletedAt: null,
      expiresAt: {
        gte: new Date(),
      },
    },
    select: {
      description: true,
      expiresAt: true,
      header: true,
      id: true,
      link: true,
    },
  });
  return forms;
};
