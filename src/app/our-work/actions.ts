"use server";

import { db } from "@/server/db";

export async function getOurWork() {
  const rows = await db.timeline.findMany({
    orderBy: [{ year: "desc" }, { monthNum: "asc" }],
    select: {
      description: true,
      imageUrl: true,
      monthName: true,
      monthNum: true,
      year: true,
    },
  });

  const grouped = rows.reduce<Record<number, typeof rows>>((acc, row) => {
    (acc[row.year] ??= []).push(row);
    return acc;
  }, {});

  return Object.entries(grouped)
    .sort((a, b) => Number(b[0]) - Number(a[0]))
    .map(([year, months]) => ({
      months: months.map((month) => ({
        description: month.description ?? "",
        image: month.imageUrl ?? null,
        month: month.monthName,
      })),
      year: String(year),
    }));
}
