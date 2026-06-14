"use server";

import {
  AccountingTeam,
  CommunicationsTeam,
  ElectricalTeam,
  LeadRoles,
  ManagerRoles,
  MechanicalTeam,
  MultiTeam,
  SoftwareTeam,
  SponsorshipTeam,
} from "@/app/_types";
import { db } from "@/server/db";
import { AllTeamRoles, type User } from "@prisma/client";

type TeamHierarchy = {
  accountingTeam: User[];
  businessTeamManager: User | null;
  commmunicationsTeam: User[];
  electricalTeam: User[];
  engineeringTeamManager: User | null;
  leadRoles: User[];
  managerRoles: User[];
  mechanicalTeam: User[];
  multiTeam: User[];
  softwareTeam: User[];
  sponsorshipTeam: User[];
  teamCaptain: User | null;
};

export type TeamPageData = {
  alumniTeam: User[];
  teamHierarchy: TeamHierarchy;
};

export async function getTeamPageData(): Promise<TeamPageData> {
  const dbUsers = await db.user.findMany();
  const teamMembers = dbUsers
    .filter((teamMember) => teamMember.teamRole !== null)
    .filter(
      (teamMember) =>
        teamMember.firstName !== null || teamMember.firstName === "",
    );

  const filterByRole = (
    teamMembers: User[],
    roles:
      | typeof AccountingTeam
      | typeof CommunicationsTeam
      | typeof ElectricalTeam
      | typeof MechanicalTeam
      | typeof MultiTeam
      | typeof SoftwareTeam
      | typeof SponsorshipTeam,
  ) => {
    return teamMembers.filter((teamMember) =>
      Object.keys(roles).includes(teamMember.teamRole!),
    );
  };

  const teamCaptain =
    teamMembers.find(
      (teamMember) => teamMember.teamRole === AllTeamRoles.TeamCaptain,
    ) ?? null;
  const engineeringTeamManager =
    teamMembers.find(
      (teamMember) =>
        teamMember.teamRole === AllTeamRoles.EngineeringTeamManager,
    ) ?? null;
  const businessTeamManager =
    teamMembers.find(
      (teamMember) => teamMember.teamRole === AllTeamRoles.BusinessTeamManager,
    ) ?? null;

  const managerRoles = teamMembers
    .filter(
      (teamMember) =>
        teamMember.teamRole !== null && teamMember.teamRole in ManagerRoles,
    )
    .filter(
      (teamMember) =>
        teamMember !== teamCaptain &&
        teamMember !== engineeringTeamManager &&
        teamMember !== businessTeamManager,
    );

  const leadRoles = teamMembers
    .filter(
      (teamMember) =>
        teamMember.teamRole !== null && teamMember.teamRole in LeadRoles,
    )
    .filter(
      (teamMember) =>
        teamMember !== teamCaptain &&
        teamMember !== engineeringTeamManager &&
        teamMember !== businessTeamManager &&
        !managerRoles.includes(teamMember),
    );

  const accountingTeam = filterByRole(teamMembers, AccountingTeam);
  const commmunicationsTeam = filterByRole(teamMembers, CommunicationsTeam);
  const sponsorshipTeam = filterByRole(teamMembers, SponsorshipTeam);
  const softwareTeam = filterByRole(teamMembers, SoftwareTeam);
  const electricalTeam = filterByRole(teamMembers, ElectricalTeam);
  const mechanicalTeam = filterByRole(teamMembers, MechanicalTeam);
  const multiTeam = filterByRole(teamMembers, MultiTeam);

  const alumniTeam = await db.user.findMany({
    orderBy: {
      yearRetired: "desc",
    },
    where: {
      yearRetired: {
        not: null,
      },
    },
  });

  return {
    alumniTeam,
    teamHierarchy: {
      accountingTeam,
      businessTeamManager,
      commmunicationsTeam,
      electricalTeam,
      engineeringTeamManager,
      leadRoles,
      managerRoles,
      mechanicalTeam,
      multiTeam,
      softwareTeam,
      sponsorshipTeam,
      teamCaptain,
    },
  };
}
