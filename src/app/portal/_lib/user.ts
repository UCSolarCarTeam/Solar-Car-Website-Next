import { adminClerkRoles } from "@/app/_types";
import type { AdminRoles } from "@/server/portal/types";

export type PortalRole = AdminRoles | "member" | "unverified";

export type PortalUser = {
  isUnverified: boolean;
  role: PortalRole | undefined;
  username: string;
};

export function isAdminRole(role: PortalRole | undefined): role is AdminRoles {
  return !!role && adminClerkRoles.includes(role as AdminRoles);
}
