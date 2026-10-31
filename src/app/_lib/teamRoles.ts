import { z } from "zod";

export const teamRoleSchema = z.object({
  adminOnly: z.boolean(),
  name: z.string().trim().min(1, "Enter a role name.").max(100),
  section: z.string().trim().min(1, "Enter a team section.").max(100),
  sortOrder: z.number().int().min(0).max(100000),
});

export type TeamRoleInput = z.infer<typeof teamRoleSchema>;
export type TeamRoleOption = TeamRoleInput & { id: number };

export function groupTeamRoleOptions(
  roles: TeamRoleOption[],
  canAssignRestricted: boolean,
  currentValue: string | null,
) {
  const groups = new Map<string, Record<string, string>>();
  for (const role of roles) {
    if (role.adminOnly && !canAssignRestricted && role.name !== currentValue) {
      continue;
    }
    const options = groups.get(role.section) ?? {};
    // Define an own property so names such as "__proto__" remain valid options.
    Object.defineProperty(options, role.name, {
      enumerable: true,
      value: role.name,
    });
    groups.set(role.section, options);
  }
  return [...groups].map(([label, options]) => ({ label, options }));
}
