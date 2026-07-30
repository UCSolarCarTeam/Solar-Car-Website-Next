"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AllTeamRoles, SponsorLevel } from "@/generated/prisma/browser";
import {
  requireAdminContext,
  requireAuthedContext,
} from "@/server/portal/context";
import { PortalError } from "@/server/portal/errors";
import {
  createAlumni as createAlumniService,
  createOurWorkEntry as createOurWorkEntryService,
  createRecruitmentForm as createRecruitmentFormService,
  createSponsor as createSponsorService,
  deleteClerkUser as deleteClerkUserService,
  deleteDBUser as deleteDBUserService,
  deleteOurWorkEntry as deleteOurWorkEntryService,
  deleteRecruitmentForm as deleteRecruitmentFormService,
  deleteSponsor as deleteSponsorService,
  getAlumniList as getAlumniListService,
  getClerkUsers as getClerkUsersService,
  getCurrentDBUser as getCurrentDBUserService,
  getDBUsers as getDBUsersService,
  getFormsList as getFormsListService,
  getInvitedUsers as getInvitedUsersService,
  getOurWorkList as getOurWorkListService,
  getSponsorsList as getSponsorsListService,
  inviteUser as inviteUserService,
  moveUserToAlumni as moveUserToAlumniService,
  parseAndNormalizeDate,
  revokeUserInvitation as revokeUserInvitationService,
  updateDBUser as updateDBUserService,
  updateOurWorkEntry as updateOurWorkEntryService,
  updateRecruitmentForm as updateRecruitmentFormService,
  updateSponsor as updateSponsorService,
  updateUserRole as updateUserRoleService,
} from "@/server/portal/service";
import { tryCatch } from "../_lib/utils";

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

function actionSuccess<T>(data: T): ActionResult<T> {
  return { data, success: true };
}

function actionError(error: unknown): ActionResult<never> {
  if (error instanceof PortalError) {
    return { error: error.message, success: false };
  }
  if (error instanceof Error) {
    return { error: error.message, success: false };
  }
  return { error: "An unexpected error occurred.", success: false };
}

const UserRoleSchema = z.enum([
  "admin",
  "business",
  "mechanicallead",
  "electricallead",
  "member",
]);

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

export async function createAlumni(
  input: z.infer<typeof createAlumniSchema>,
): Promise<ActionResult<Awaited<ReturnType<typeof createAlumniService>>>> {
  return await performOperation(
    createAlumniService,
    input,
    createAlumniSchema,
    ["/team", "/portal/alumni", "/portal/team"],
  );
}

const createAlumniSchema = z.object({
  company: z.string().nullable(),
  companyTitle: z.string().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  linkedIn: z.string().nullable(),
  profilePictureUrl: z.string().nullable(),
  teamRole: z.nativeEnum(AllTeamRoles).nullable(),
  yearJoined: z.preprocess((v) => parseAndNormalizeDate(v), z.date()),
  yearRetired: z.preprocess((v) => parseAndNormalizeDate(v), z.date()),
});

export async function createOurWorkEntry(
  input: z.infer<typeof createOurWorkEntrySchema>,
): Promise<
  ActionResult<Awaited<ReturnType<typeof createOurWorkEntryService>>>
> {
  return await performOperation(
    createOurWorkEntryService,
    input,
    createOurWorkEntrySchema,
    ["/portal/our-work"],
  );
}

const createOurWorkEntrySchema = z.object({
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  monthName: z.string(),
  monthNum: z.number(),
  year: z.number(),
});

export async function createRecruitmentForm(
  input: z.infer<typeof createRecruitmentFormSchema>,
): Promise<
  ActionResult<Awaited<ReturnType<typeof createRecruitmentFormService>>>
> {
  return await performOperation(
    createRecruitmentFormService,
    input,
    createRecruitmentFormSchema,
    ["/portal/recruitment"],
  );
}

const createRecruitmentFormSchema = z.object({
  description: z.string(),
  expiresAt: z.string(),
  header: z.string(),
  link: z.string(),
});

export async function createSponsor(
  input: z.infer<typeof createSponsorSchema>,
): Promise<ActionResult<Awaited<ReturnType<typeof createSponsorService>>>> {
  return await performOperation(
    createSponsorService,
    input,
    createSponsorSchema,
    ["/sponsors", "/portal/sponsors"],
  );
}

const createSponsorSchema = z.object({
  description: z.string().nullable(),
  logoUrl: z.string(),
  name: z.string(),
  sponsorLevel: z.nativeEnum(SponsorLevel),
  websiteUrl: z.string(),
});

export async function deleteClerkUser(input: {
  clerkId: string;
}): Promise<ActionResult<Awaited<ReturnType<typeof deleteClerkUserService>>>> {
  return await performOperation(
    deleteClerkUserService,
    input,
    z.object({ clerkId: z.string() }),
    ["/portal/users"],
  );
}

export async function deleteDBUser(input: {
  id: number;
}): Promise<ActionResult<Awaited<ReturnType<typeof deleteDBUserService>>>> {
  return await performOperation(
    deleteDBUserService,
    input,
    z.object({ id: z.number() }),
    ["/team", "/portal/users", "/portal/team", "/portal/alumni"],
  );
}

export async function deleteOurWorkEntry(input: {
  id: number;
}): Promise<ActionResult<boolean>> {
  return await performOperation(
    deleteOurWorkEntryService,
    input,
    z.object({ id: z.number() }),
    ["/portal/our-work"],
  );
}

export async function deleteRecruitmentForm(input: {
  id: number;
}): Promise<ActionResult<boolean>> {
  return await performOperation(
    deleteRecruitmentFormService,
    input,
    z.object({ id: z.number() }),
    ["/portal/recruitment"],
  );
}

export async function deleteSponsor(input: {
  id: number;
}): Promise<ActionResult<Awaited<ReturnType<typeof deleteSponsorService>>>> {
  return await performOperation(
    deleteSponsorService,
    input,
    z.object({ id: z.number() }),
    ["/sponsors", "/portal/sponsors"],
  );
}

export async function inviteUser(
  input: z.infer<typeof inviteUserSchema>,
): Promise<ActionResult<boolean>> {
  return await performOperation(inviteUserService, input, inviteUserSchema, [
    "/portal/invitations",
  ]);
}

const inviteUserSchema = z.object({
  email: z.string().email(),
  selectedRole: UserRoleSchema,
});

const performOperation = async <T, I extends z.ZodTypeAny>(
  operation: (
    ctx: Awaited<ReturnType<typeof requireAdminContext>>,
    input: z.infer<I>,
  ) => Promise<T>,
  input: z.infer<I>,
  schema: I,
  pathsToRevalidate: string[] = [],
) => {
  const ctx = await requireAdminContext();
  const parsed = schema.parse(input);
  const { data, error } = await tryCatch(operation(ctx, parsed));
  if (error != null) return actionError(error);

  for (const path of pathsToRevalidate) revalidatePath(path);
  return actionSuccess(data);
};

export const moveUserToAlumni = async (
  input: z.infer<typeof moveUserToAlumniSchema>,
) =>
  await performOperation(
    moveUserToAlumniService,
    input,
    moveUserToAlumniSchema,
    ["/team", "/portal/alumni", "/portal/team", "/portal/users"],
  );

const moveUserToAlumniSchema = z.object({
  company: z.string().nullable().optional(),
  companyTitle: z.string().nullable().optional(),
  id: z.number(),
  yearRetired: z.preprocess((v) => parseAndNormalizeDate(v), z.date()),
});

export async function revokeUserInvitation(input: {
  invitationId: string;
}): Promise<
  ActionResult<Awaited<ReturnType<typeof revokeUserInvitationService>>>
> {
  try {
    const parsed = z.object({ invitationId: z.string() }).parse(input);
    const ctx = await requireAdminContext();
    const data = await revokeUserInvitationService(ctx, parsed);
    revalidatePath("/portal/invitations");
    return actionSuccess(data);
  } catch (error) {
    return actionError(error);
  }
}

export async function updateDBUser(
  input: z.infer<typeof updateDBUserSchema>,
): Promise<ActionResult<boolean>> {
  try {
    const parsed = updateDBUserSchema.parse(input);
    const ctx = await requireAuthedContext();
    const data = await updateDBUserService(ctx, parsed);
    revalidatePath("/team");
    revalidatePath("/portal/profile");
    revalidatePath("/portal/team");
    return actionSuccess(data);
  } catch (error) {
    return actionError(error);
  }
}

const updateDBUserSchema = z.object({
  company: z.string().nullable(),
  companyTitle: z.string().nullable(),
  description: z.string().nullable(),
  fieldOfStudy: z.string().nullable(),
  firstName: z.string().nullable(),
  id: z.number(),
  lastName: z.string().nullable(),
  linkedIn: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  profilePictureUrl: z.string().nullable(),
  schoolEmail: z.string().nullable(),
  schoolYear: z.string().nullable(),
  teamRole: z.nativeEnum(AllTeamRoles).nullable(),
  ucid: z.string().nullable(),
  yearJoined: z.preprocess((v) => {
    if (v === null || v === undefined) return null;
    return parseAndNormalizeDate(v);
  }, z.date().nullable()),
  yearRetired: z.preprocess((v) => {
    if (v === null || v === undefined) return null;
    return parseAndNormalizeDate(v);
  }, z.date().nullable()),
});

export async function updateOurWorkEntry(
  input: z.infer<typeof updateOurWorkEntrySchema>,
): Promise<ActionResult<boolean>> {
  return await performOperation(
    updateOurWorkEntryService,
    input,
    updateOurWorkEntrySchema,
    ["/portal/our-work"],
  );
}

const updateOurWorkEntrySchema = z.object({
  description: z.string().nullable(),
  id: z.number(),
  imageUrl: z.string().nullable(),
  monthName: z.string().nullable(),
  monthNum: z.number().nullable(),
  year: z.number().nullable(),
});

export async function updateRecruitmentForm(
  input: z.infer<typeof updateRecruitmentFormSchema>,
): Promise<ActionResult<boolean>> {
  return await performOperation(
    updateRecruitmentFormService,
    input,
    updateRecruitmentFormSchema,
    ["/portal/recruitment"],
  );
}

const updateRecruitmentFormSchema = z.object({
  description: z.string().nullable(),
  expiresAt: z.string().nullable(),
  header: z.string().nullable(),
  id: z.number(),
  link: z.string().nullable(),
});

export async function updateSponsor(
  input: z.infer<typeof updateSponsorSchema>,
): Promise<ActionResult<boolean>> {
  return await performOperation(
    updateSponsorService,
    input,
    updateSponsorSchema,
    ["/sponsors", "/portal/sponsors"],
  );
}

const updateSponsorSchema = z.object({
  description: z.string().nullable(),
  id: z.number(),
  logoUrl: z.string().nullable(),
  name: z.string().nullable(),
  sponsorLevel: z.nativeEnum(SponsorLevel),
  websiteUrl: z.string().nullable(),
});

export async function updateUserRole(
  input: z.infer<typeof updateUserRoleSchema>,
): Promise<ActionResult<boolean>> {
  return await performOperation(
    updateUserRoleService,
    input,
    updateUserRoleSchema,
    ["/portal/users"],
  );
}

const updateUserRoleSchema = z.object({
  role: UserRoleSchema,
  userId: z.string(),
});
