"use client";

import { createContext, useContext } from "react";
import type { TeamRoleOption } from "@/app/_lib/teamRoles";

const TeamRolesContext = createContext<TeamRoleOption[]>([]);

export function TeamRolesProvider({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: TeamRoleOption[];
}) {
  return (
    <TeamRolesContext.Provider value={roles}>
      {children}
    </TeamRolesContext.Provider>
  );
}

export function useTeamRoles() {
  return useContext(TeamRolesContext);
}
