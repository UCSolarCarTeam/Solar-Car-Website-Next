'use server'
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
import { AllTeamRoles, type User } from "@/generated/prisma/browser";
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

type SubteamRoles =
  | typeof AccountingTeam
  | typeof CommunicationsTeam
  | typeof ElectricalTeam
  | typeof MechanicalTeam
  | typeof MultiTeam
  | typeof SoftwareTeam
  | typeof SponsorshipTeam;

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

function filterByRole(teamMembers: PublicTeamMember[], roles: SubteamRoles) {
  return teamMembers.filter(
    (teamMember) =>
      teamMember.teamRole !== null &&
      Object.keys(roles).includes(teamMember.teamRole),
  );
}

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
  const dbUsers = await db.user.findMany({
    select: publicTeamMemberSelect,
    where: {
      deletedAt: null,
    },
  });
  const teamMembers = dbUsers.filter(
    (teamMember) =>
      teamMember.teamRole !== null && teamMember.firstName !== null,
  );

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

  return {
    accountingTeam: filterByRole(teamMembers, AccountingTeam),
    businessTeamManager,
    commmunicationsTeam: filterByRole(teamMembers, CommunicationsTeam),
    electricalTeam: filterByRole(teamMembers, ElectricalTeam),
    engineeringTeamManager,
    leadRoles,
    managerRoles,
    mechanicalTeam: filterByRole(teamMembers, MechanicalTeam),
    multiTeam: filterByRole(teamMembers, MultiTeam),
    softwareTeam: filterByRole(teamMembers, SoftwareTeam),
    sponsorshipTeam: filterByRole(teamMembers, SponsorshipTeam),
    teamCaptain,
  };
}
