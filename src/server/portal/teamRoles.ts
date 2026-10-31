import type { TeamRoleInput } from "@/app/_lib/teamRoles";
import { Prisma } from "@/generated/prisma/client";
import type { PortalContext } from "./context";
import { PortalError } from "./errors";

export async function requireRoleAdministrator(ctx: PortalContext) {
  if (!ctx.user) throw new PortalError("Unauthorized");
  const user = await ctx.clerkClient.users.getUser(ctx.user.id);
  if (user.publicMetadata?.role !== "admin") {
    throw new PortalError("Only admins can manage team roles.");
  }
}

export async function assertAssignableRole(
  db: Prisma.TransactionClient,
  name: string | null,
  canAssignRestricted: boolean,
) {
  if (!name) return;
  const role = await db.teamRole.findUnique({ where: { name } });
  if (!role)
    throw new PortalError(
      "This team role no longer exists. Refresh and choose another role.",
    );
  if (role.adminOnly && !canAssignRestricted) {
    throw new PortalError("You must be an admin to assign this role.");
  }
}

export async function saveTeamRole(
  ctx: PortalContext,
  input: TeamRoleInput & { id?: number },
) {
  await requireRoleAdministrator(ctx);
  const { id, ...fields } = input;
  const data = { ...fields, modifiedBy: ctx.user!.id };
  try {
    return id === undefined
      ? await ctx.db.teamRole.create({ data })
      : await ctx.db.teamRole.update({ data, where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002")
        throw new PortalError("A role with this name already exists.");
      if (error.code === "P2025")
        throw new PortalError("This role no longer exists. Refresh the page.");
    }
    throw error;
  }
}

export async function deleteTeamRole(ctx: PortalContext, id: number) {
  await requireRoleAdministrator(ctx);
  try {
    await ctx.db.teamRole.delete({ where: { id } });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2003") {
        throw new PortalError(
          "This role is assigned to members. Reassign them before deleting it.",
        );
      }
      if (error.code === "P2025")
        throw new PortalError("This role no longer exists. Refresh the page.");
    }
    throw error;
  }
  return true;
}
