import "server-only";

import {
  requireAdminContext,
  requireAuthedContext,
} from "@/server/portal/context";
import {
  getAlumniList as getAlumniListService,
  getClerkUsers as getClerkUsersService,
  getCurrentDBUser as getCurrentDBUserService,
  getDBUsers as getDBUsersService,
  getFormsList as getFormsListService,
  getInvitedUsers as getInvitedUsersService,
  getOurWorkList as getOurWorkListService,
  getSponsorsList as getSponsorsListService,
} from "@/server/portal/service";

export async function getDBUsers() {
  const ctx = await requireAdminContext();
  return getDBUsersService(ctx);
}

export async function getClerkUsers() {
  const ctx = await requireAdminContext();
  return getClerkUsersService(ctx);
}

export async function getSponsorsList() {
  const ctx = await requireAdminContext();
  return getSponsorsListService(ctx);
}

export async function getFormsList() {
  const ctx = await requireAdminContext();
  return getFormsListService(ctx);
}

export async function getInvitedUsers() {
  const ctx = await requireAdminContext();
  return getInvitedUsersService(ctx);
}

export async function getOurWorkList() {
  const ctx = await requireAdminContext();
  return getOurWorkListService(ctx);
}

export async function getAlumniList() {
  const ctx = await requireAdminContext();
  return getAlumniListService(ctx);
}

export async function getCurrentDBUser() {
  const ctx = await requireAuthedContext();
  return getCurrentDBUserService(ctx);
}
