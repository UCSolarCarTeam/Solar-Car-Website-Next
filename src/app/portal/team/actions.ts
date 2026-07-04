"use server";

import { db } from "@/server/db";

export const getDBUsers = async () =>
  db.user.findMany({
    orderBy: { id: "desc" },
    where: {
      deletedAt: null,
    },
  });
