export interface SVGIconProps {
  className?: string;
  height?: number;
  width?: number;
  fill?: string;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
}

export enum UpperTeamRoles {
  TeamCaptain = "Team Captain",
  EngineeringTeamManager = "Engineering Team Manager",
  BusinessTeamManager = "Business Team Manager",
  ElectricalCoManager = "Electrical Co-Manager",
  AccountingCoManager = "Accounting Co-Manager",
  AssistantAccountingManager = "Assistant Accounting Manager",
  CommunicationsManager = "Communications Manager",
  SponsorshipManager = "Sponsorship Manager",
  SponsorshipAssistantManager = "Sponsorship Assistant Manager",
  MonetaryLead = "Monetary Lead",
  InKindLead = "In-Kind Lead",
  SoftwareTeamLead = "Software Team Lead",
  EmbeddedTeamLead = "Embedded Team Lead",
  TelemetryTeamLead = "Telemetry Team Lead",
  ViscommTeamLead = "Viscomm Team Lead",
  ArraysLead = "Arrays Lead",
  EnergyStorageLead = "Energy Storage Lead",
  HighVoltageLead = "High Voltage Lead",
  LowVoltageLead = "Low Voltage Lead",
  MechanicalManager = "Mechanical Manager",
  SuspensionAndSteeringLead = "Suspension & Steering Lead",
  StructuresLead = "Structures Lead",
  ElectricalIntegrationLead = "Electrical Integration Lead",
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
