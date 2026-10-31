import type { TeamRoleOption } from "@/app/_lib/teamRoles";
import type { PublicTeamMember } from "./actions";

// Roles arrive in display order; sections follow their first role's position.
export function groupPublicTeamMembers(
  members: PublicTeamMember[],
  roles: TeamRoleOption[],
) {
  const sections = new Map<string, PublicTeamMember[]>();
  const membersByRole = new Map<string, PublicTeamMember[]>();
  for (const member of members) {
    if (member.teamRole === null || member.firstName === null) continue;
    const assigned = membersByRole.get(member.teamRole) ?? [];
    assigned.push(member);
    membersByRole.set(member.teamRole, assigned);
  }
  for (const role of roles) {
    const section = sections.get(role.section) ?? [];
    section.push(...(membersByRole.get(role.name) ?? []));
    sections.set(role.section, section);
  }
  return [...sections]
    .filter(([, sectionMembers]) => sectionMembers.length > 0)
    .map(([title, sectionMembers]) => ({ title, members: sectionMembers }));
}
