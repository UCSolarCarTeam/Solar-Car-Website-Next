import type { Prisma } from "@/generated/prisma/browser";

export interface SVGIconProps {
  className?: string;
  height?: number;
  width?: number;
  fill?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export const adminClerkRoles = [
  "admin",
  "business",
  "mechanicallead",
  "electricallead",
] as const;

export const allClerkRoles = [
  "member",
  "admin",
  "business",
  "mechanicallead",
  "electricallead",
] as const;

export enum PortalNavigationLinks {
  Team = "team",
  Users = "users",
  Sponsors = "sponsors",
  Recruitment = "recruitment",
  Invitations = "invitations",
  OurWork = "our-work",
  Alumni = "alumni",
  TeamRoles = "team-roles",
}

export const portalNavItems = [
  {
    href: "/portal/team-roles",
    label: "Team Roles",
    segment: PortalNavigationLinks.TeamRoles,
  },
  { href: "/portal/team", label: "Team", segment: PortalNavigationLinks.Team },
  {
    href: "/portal/users",
    label: "Users",
    segment: PortalNavigationLinks.Users,
  },
  {
    href: "/portal/sponsors",
    label: "Sponsors",
    segment: PortalNavigationLinks.Sponsors,
  },
  {
    href: "/portal/invitations",
    label: "Invitations",
    segment: PortalNavigationLinks.Invitations,
  },
  {
    href: "/portal/recruitment",
    label: "Recruitment",
    segment: PortalNavigationLinks.Recruitment,
  },
  {
    href: "/portal/our-work",
    label: "Our Work",
    segment: PortalNavigationLinks.OurWork,
  },
  {
    href: "/portal/alumni",
    label: "Alumni",
    segment: PortalNavigationLinks.Alumni,
  },
] as const;

type UserPrismaMetadata = Prisma.UserScalarFieldEnum;
export const userRowMetadata = {
  company: "string",
  companyTitle: "string",
  description: "string",
  fieldOfStudy: "string",
  firstName: "string",
  lastName: "string",
  linkedIn: "string",
  phoneNumber: "string",
  schoolEmail: "string",
  schoolYear: "string",
  ucid: "string",
  yearJoined: "date",
  yearRetired: "date",
} as const satisfies Partial<Record<UserPrismaMetadata, "string" | "date">>;
