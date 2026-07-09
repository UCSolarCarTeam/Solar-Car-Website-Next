import type { AllTeamRoles, SponsorLevel } from "@prisma/client";
import { LeadRoles, ManagerRoles } from "@/app/_types";

import type { PortalContext } from "./context";
import { PortalError } from "./errors";
import type {
  ClerkPortalUser,
  OurWorkListItem,
  PortalInvitation,
  RecruitmentFormListItem,
  UserRole,
} from "./types";

// Server-side parser/normalizer for date inputs (accepts Date, YYYY or YYYY-MM-DD strings)
// Returns a Date set to UTC midnight or null if input is falsy/invalid
export const parseAndNormalizeDate = (val: unknown): Date | null => {
  if (val === null || val === undefined || val === "") return null;

  if (val instanceof Date) {
    // Normalize to UTC midnight
    return new Date(
      Date.UTC(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate()),
    );
  }

  if (typeof val === "string") {
    const s = val.trim();
    // Year-only (YYYY)
    if (/^\d{4}$/.test(s)) {
      const y = Number(s);
      return new Date(Date.UTC(y, 0, 1));
    }

    // Full ISO-like date YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
      const [yStr, mStr, dStr] = s.split("-");
      const y = Number(yStr);
      const m = Number(mStr);
      const d = Number(dStr);
      const dt = new Date(Date.UTC(y, m - 1, d));
      // Validate round-trip to catch invalid dates like 2026-02-30
      if (
        dt.getUTCFullYear() === y &&
        dt.getUTCMonth() === m - 1 &&
        dt.getUTCDate() === d
      ) {
        return dt;
      }
      return null;
    }
  }

  return null;
};

export async function createAlumni(
  ctx: PortalContext,
  input: {
    company: string | null;
    companyTitle: string | null;
    firstName: string;
    lastName: string;
    linkedIn: string | null;
    profilePictureUrl: string | null;
    teamRole: AllTeamRoles | null;
    yearJoined: unknown;
    yearRetired: unknown;
  },
) {
  return ctx.db.user.create({
    data: {
      company: input.company ?? null,
      companyTitle: input.companyTitle ?? null,
      firstName: input.firstName,
      lastName: input.lastName,
      linkedIn: input.linkedIn ?? null,
      profilePictureUrl: input.profilePictureUrl ?? null,
      teamRole: input.teamRole ?? null,
      yearJoined: parseAndNormalizeDate(input.yearJoined),
      yearRetired: parseAndNormalizeDate(input.yearRetired),
    },
  });
}

export async function createOurWorkEntry(
  ctx: PortalContext,
  input: {
    description: string | null;
    imageUrl: string | null;
    monthName: string;
    monthNum: number;
    year: number;
  },
) {
  return ctx.db.timeline.create({
    data: {
      description: input.description,
      imageUrl: input.imageUrl,
      monthName: input.monthName,
      monthNum: input.monthNum,
      year: input.year,
    },
  });
}

export async function createRecruitmentForm(
  ctx: PortalContext,
  input: {
    description: string;
    expiresAt: string;
    header: string;
    link: string;
  },
) {
  return ctx.db.recruitment.create({
    data: {
      description: input.description,
      expiresAt: input.expiresAt,
      header: input.header,
      link: input.link,
    },
  });
}

export async function createSponsor(
  ctx: PortalContext,
  input: {
    description: string | null;
    logoUrl: string;
    name: string;
    sponsorLevel: SponsorLevel;
    websiteUrl: string;
  },
) {
  return ctx.db.sponsor.create({
    data: {
      description: input.description,
      logoUrl: input.logoUrl,
      name: input.name,
      sponsorLevel: input.sponsorLevel,
      websiteUrl: input.websiteUrl,
    },
  });
}

export async function deleteClerkUser(
  ctx: PortalContext,
  input: { clerkId: string },
) {
  return ctx.clerkClient.users.deleteUser(input.clerkId);
}

export async function deleteDBUser(ctx: PortalContext, input: { id: number }) {
  return ctx.db.user.update({
    data: {
      deletedAt: new Date(),
      modifiedBy: ctx.user?.id,
    },
    where: {
      id: input.id,
    },
  });
}

export async function deleteOurWorkEntry(
  ctx: PortalContext,
  input: { id: number },
) {
  await ctx.db.timeline.update({
    data: {
      deletedAt: new Date(),
      modifiedBy: ctx.user?.id,
    },
    where: {
      id: input.id,
    },
  });
  return true;
}

export async function deleteRecruitmentForm(
  ctx: PortalContext,
  input: { id: number },
) {
  await ctx.db.recruitment.update({
    data: {
      deletedAt: new Date(),
      modifiedBy: ctx.user?.id,
    },
    where: {
      id: input.id,
    },
  });
  return true;
}

export async function deleteSponsor(ctx: PortalContext, input: { id: number }) {
  return ctx.db.sponsor.update({
    data: {
      deletedAt: new Date(),
      modifiedBy: ctx.user?.id,
    },
    where: {
      id: input.id,
    },
  });
}

export async function getAlumniList(ctx: PortalContext) {
  return ctx.db.user.findMany({
    orderBy: {
      yearRetired: "desc",
    },
    where: {
      deletedAt: null,
      yearRetired: {
        not: null,
      },
    },
  });
}

export async function getClerkUsers(
  ctx: PortalContext,
): Promise<ClerkPortalUser[]> {
  const users = await ctx.clerkClient.users.getUserList({
    limit: 500,
  });

  return users.data
    .sort((a, b) => {
      // Sort users with null role to the beginning
      if (
        a.publicMetadata?.role === null ||
        a.publicMetadata?.role === undefined
      )
        return -1;
      if (
        b.publicMetadata?.role === null ||
        b.publicMetadata?.role === undefined
      )
        return 1;
      return 0;
    })
    .map((user) => ({
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      id: user.id,
      imageUrl: user.hasImage ? user.imageUrl : undefined,
      lastName: user.lastName,
      publicMetadata: user.publicMetadata,
      role: user.publicMetadata?.role,
      username: user.username,
    }));
}

export async function getCurrentDBUser(ctx: PortalContext) {
  const user = await ctx.db.user.findUnique({
    where: {
      clerkUserId: ctx.user?.id,
    },
  });
  return user?.deletedAt ? null : user;
}

export async function getDBUsers(ctx: PortalContext) {
  return ctx.db.user.findMany({
    orderBy: { id: "desc" },
    where: {
      deletedAt: null,
    },
  });
}

export async function getFormsList(
  ctx: PortalContext,
): Promise<RecruitmentFormListItem[]> {
  return ctx.db.recruitment.findMany({
    select: {
      description: true,
      expiresAt: true,
      header: true,
      id: true,
      link: true,
    },
    where: {
      deletedAt: null,
    },
  });
}

export async function getInvitedUsers(
  ctx: PortalContext,
): Promise<PortalInvitation[]> {
  const invitations = await ctx.clerkClient.invitations.getInvitationList({
    limit: 500,
  });

  return invitations.data.map((invitation) => ({
    createdAt: invitation.createdAt,
    email: invitation.emailAddress,
    id: invitation.id,
    status: invitation.status,
  }));
}

export async function getOurWorkList(
  ctx: PortalContext,
): Promise<OurWorkListItem[]> {
  return ctx.db.timeline.findMany({
    orderBy: [{ year: "desc" }, { monthNum: "desc" }],
    select: {
      description: true,
      id: true,
      imageUrl: true,
      monthName: true,
      monthNum: true,
      year: true,
    },
    where: {
      deletedAt: null,
    },
  });
}

export async function getSponsorsList(ctx: PortalContext) {
  return ctx.db.sponsor.findMany({
    where: {
      deletedAt: null,
    },
  });
}

export async function inviteUser(
  ctx: PortalContext,
  input: { email: string; selectedRole: UserRole },
) {
  const existingInvitation =
    await ctx.clerkClient.invitations.getInvitationList({
      limit: 1,
      query: input.email,
    });

  if (existingInvitation.data[0]) {
    const invitation = existingInvitation.data[0];

    if ((invitation.status as string) === "pending") {
      throw new PortalError(
        "This user has already been invited. Please remind them to check their spam",
      );
    }

    if ((invitation.status as string) === "expired") {
      try {
        await ctx.clerkClient.invitations.revokeInvitation(invitation.id);
      } catch {
        throw new PortalError("Failed to revoke expired invitation.");
      }
    }
  }

  // if the invitation was either expired or revoked, create a new invitation
  await ctx.clerkClient.invitations.createInvitation({
    emailAddress: input.email,
    publicMetadata: {
      role: input.selectedRole,
    },
  });
  return true;
}

export async function moveUserToAlumni(
  ctx: PortalContext,
  input: {
    company?: string | null;
    companyTitle?: string | null;
    id: number;
    yearRetired: unknown;
  },
) {
  await ctx.db.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!user) {
      throw new PortalError("User not found.");
    }

    if (user.deletedAt) {
      throw new PortalError("Deleted users cannot be moved to alumni.");
    }

    await tx.user.update({
      data: {
        company: input.company ?? undefined,
        companyTitle: input.companyTitle ?? undefined,
        yearRetired: parseAndNormalizeDate(input.yearRetired),
      },
      where: { id: input.id },
    });
  });
  return true;
}

export async function revokeUserInvitation(
  ctx: PortalContext,
  input: { invitationId: string },
) {
  return ctx.clerkClient.invitations.revokeInvitation(input.invitationId);
}

export async function updateDBUser(
  ctx: PortalContext,
  input: {
    company: string | null;
    companyTitle: string | null;
    description: string | null;
    fieldOfStudy: string | null;
    firstName: string | null;
    id: number;
    lastName: string | null;
    linkedIn: string | null;
    phoneNumber: string | null;
    profilePictureUrl: string | null;
    schoolEmail: string | null;
    schoolYear: string | null;
    teamRole: AllTeamRoles | null;
    ucid: string | null;
    yearJoined: unknown;
    yearRetired: unknown;
  },
) {
  if (!ctx.user?.id) {
    throw new PortalError("User not authenticated.");
  }

  const user = await ctx.clerkClient.users.getUser(ctx.user.id);
  const isUpperTeamRole =
    Object.values(ManagerRoles).includes(input.teamRole as ManagerRoles) ||
    Object.values(LeadRoles).includes(input.teamRole as LeadRoles);

  if (isUpperTeamRole && user.publicMetadata?.role !== "admin") {
    throw new PortalError("You must be an admin to assign this role.");
  }

  // Normalize any incoming year/date value to a UTC midnight Date (or null)
  const convertToDate = (val: unknown): Date | null =>
    parseAndNormalizeDate(val);

  await ctx.db.$transaction(async (tx) => {
    const dbUser = await tx.user.findUnique({
      where: {
        id: input.id,
      },
    });

    if (!dbUser) {
      throw new PortalError("User not found.");
    }

    if (dbUser.deletedAt) {
      throw new PortalError("Deleted users cannot be updated.");
    }

    await tx.user.update({
      data: {
        company: input.company,
        companyTitle: input.companyTitle,
        description: input.description,
        fieldOfStudy: input.fieldOfStudy,
        firstName: input.firstName,
        lastName: input.lastName,
        linkedIn: input.linkedIn,
        phoneNumber: input.phoneNumber,
        profilePictureUrl: input.profilePictureUrl,
        schoolEmail: input.schoolEmail,
        schoolYear: input.schoolYear,
        teamRole: input.teamRole,
        ucid: input.ucid,
        yearJoined: convertToDate(input.yearJoined),
        yearRetired: convertToDate(input.yearRetired),
      },
      where: { id: input.id },
    });
  });

  return true;
}

export async function updateOurWorkEntry(
  ctx: PortalContext,
  input: {
    description: string | null;
    id: number;
    imageUrl: string | null;
    monthName: string | null;
    monthNum: number | null;
    year: number | null;
  },
) {
  // only update the fields that are non null
  const updateData = {
    description: input.description,
    imageUrl: input.imageUrl,
    monthName: input.monthName,
    monthNum: input.monthNum,
    year: input.year,
  };
  const filteredUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([_, value]) => value !== null),
  );

  await ctx.db.timeline.update({
    data: filteredUpdateData,
    where: {
      id: input.id,
    },
  });
  return true;
}

export async function updateRecruitmentForm(
  ctx: PortalContext,
  input: {
    description: string | null;
    expiresAt: string | null;
    header: string | null;
    id: number;
    link: string | null;
  },
) {
  // only update the fields that are non null
  const updateData = {
    description: input.description,
    expiresAt: input.expiresAt,
    header: input.header,
    link: input.link,
  };
  const filteredUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([_, value]) => value !== null),
  );

  await ctx.db.recruitment.update({
    data: filteredUpdateData,
    where: {
      id: input.id,
    },
  });
  return true;
}

export async function updateSponsor(
  ctx: PortalContext,
  input: {
    description: string | null;
    id: number;
    logoUrl: string | null;
    name: string | null;
    sponsorLevel: SponsorLevel;
    websiteUrl: string | null;
  },
) {
  // only update the fields that are non null
  const updateData = {
    description: input.description,
    logoUrl: input.logoUrl,
    name: input.name,
    sponsorLevel: input.sponsorLevel,
    websiteUrl: input.websiteUrl,
  };
  const filteredUpdateData = Object.fromEntries(
    Object.entries(updateData).filter(([_, value]) => value !== null),
  );

  await ctx.db.sponsor.update({
    data: filteredUpdateData,
    where: {
      id: input.id,
    },
  });
  return true;
}

export async function updateUserRole(
  ctx: PortalContext,
  input: { role: UserRole; userId: string },
) {
  if (input.userId) {
    await ctx.clerkClient.users.updateUserMetadata(input.userId, {
      publicMetadata: {
        role: input.role,
      },
    });
  }
  return true;
}
