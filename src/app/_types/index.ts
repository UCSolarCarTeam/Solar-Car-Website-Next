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
}

export enum ManagerRoles {
  TeamCaptain = "Team Captain",
  EngineeringTeamManager = "Engineering Team Manager",
  BusinessTeamManager = "Business Team Manager",
  ElectricalTechnicalManager = "Electrical Technical Manager",
  ElectricalManager = "Electrical Manager",
  ElectricalCoManager = "Electrical Co-Manager",
  AccountingCoManager = "Accounting Co-Manager",
  AssistantAccountingManager = "Assistant Accounting Manager",
  CommunicationsManager = "Communications Manager",
  SponsorshipManager = "Sponsorship Manager",
  SponsorshipAssistantManager = "Sponsorship Assistant Manager",
  SoftwareTeamManager = "Software Team Manager",
  SoftwareTechnicalManager = "Software Technical Manager",
  MechanicalManager = "Mechanical Manager",
  MechanicalTechnicalManager = "Mechanical Technical Manager",
}

export enum LeadRoles {
  ElectricalIntegrationLead = "Electrical Integration Lead",
  MonetaryLead = "Monetary Lead",
  InKindLead = "In-Kind Lead",
  EmbeddedTeamLead = "Embedded Team Lead",
  TelemetryTeamLead = "Telemetry Team Lead",
  ViscommTeamLead = "Viscomm Team Lead",
  ArraysLead = "Arrays Lead",
  EnergyStorageLead = "Energy Storage Lead",
  HighVoltageLead = "High Voltage Lead",
  LowVoltageLead = "Low Voltage Lead",
  SuspensionAndSteeringLead = "Suspension & Steering Lead",
  BodyAndChassisLead = "Body & Chassis Lead",
  StructuresLead = "Structures Lead",
}

export enum AccountingTeam {
  AccountingAnalyst = "Accounting Analyst",
  AccountingAssociate = "Accounting Associate",
}

export enum CommunicationsTeam {
  EventAssociate = "Event Associate",
  MarketingAssociate = "Marketing Associate",
  Videographer = "Videographer",
  MarketingAndEventsAssociate = "Marketing & Events Associate",
}

export enum SponsorshipTeam {
  SponsorshipAssociate = "Sponsorship Associate",
}

export enum SoftwareTeam {
  EmbeddedTeam = "Embedded Team",
  TelemetryTeam = "Telemetry Team",
  ViscommTeam = "Viscomm Team",
}

export enum ElectricalTeam {
  ArraysTeam = "Arrays Team",
  EnergyStorageTeam = "Energy Storage Team",
  HighVoltageTeam = "High Voltage Team",
  LowVoltageTeam = "Low Voltage Team",
  ElectricalTeam = "Electrical Team",
}

export enum MechanicalTeam {
  SuspensionAndSteeringTeam = "Suspension & Steering Team",
  StructuresTeam = "Structures Team",
  ElectricalIntegrationTeam = "Electrical Integration Team",
  BodyAndChassisTeam = "Body & Chassis Team",
}

export enum MultiTeam {
  MultiTeam = "Multi Team",
}

export const teamRoleOptions = [
  {
    label: "Accounting",
    options: AccountingTeam,
  },
  {
    label: "Communications",
    options: CommunicationsTeam,
  },
  {
    label: "Sponsorship",
    options: SponsorshipTeam,
  },
  {
    label: "Software",
    options: SoftwareTeam,
  },
  {
    label: "Electrical",
    options: ElectricalTeam,
  },
  {
    label: "Mechanical",
    options: MechanicalTeam,
  },
  {
    label: "Multi-Team",
    options: MultiTeam,
  },
];

export const userRowMetadata = {
  description: "string",
  fieldOfStudy: "string",
  firstName: "string",
  lastName: "string",
  phoneNumber: "string",
  schoolEmail: "string",
  schoolYear: "string",
  ucid: "number",
  yearJoined: "string",
  linkedIn: "string",
};
