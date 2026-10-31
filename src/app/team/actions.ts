"use server";
import { groupPublicTeamMembers } from "@/app/team/groupMembers";
import type { User } from "@/generated/prisma/browser";
import { db } from "@/server/db";

export type PublicTeamMember = Pick<
  User,
  | "company"
  | "companyTitle"
  | "description"
  | "fieldOfStudy"
  | "firstName"
  | "id"
  | "lastName"
  | "linkedIn"
  | "profilePictureUrl"
  | "teamRole"
  | "yearJoined"
  | "yearRetired"
>;

const publicTeamMemberSelect = {
  company: true,
  companyTitle: true,
  description: true,
  fieldOfStudy: true,
  firstName: true,
  id: true,
  lastName: true,
  linkedIn: true,
  profilePictureUrl: true,
  teamRole: true,
  yearJoined: true,
  yearRetired: true,
} as const;

export async function getPublicAlumni() {
  return db.user.findMany({
    orderBy: {
      yearRetired: "desc",
    },
    select: publicTeamMemberSelect,
    where: {
      deletedAt: null,
      yearRetired: {
        not: null,
      },
    },
  });
}

export async function getPublicTeamMembers() {
  const [members, roles] = await Promise.all([
    db.user.findMany({
      select: publicTeamMemberSelect,
      where: { deletedAt: null, yearRetired: null },
      orderBy: [{ lastName: "asc" }, { firstName: "asc" }, { id: "asc" }],
    }),
    db.teamRole.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
  ]);
  return groupPublicTeamMembers(members, roles);
}
