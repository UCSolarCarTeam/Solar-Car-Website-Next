export type UserRole =
  | "admin"
  | "business"
  | "mechanicallead"
  | "electricallead"
  | "member";

export type AdminRoles = Exclude<UserRole, "member">;

export type ClerkPortalUser = {
  email: string | undefined;
  firstName: string | null;
  id: string;
  imageUrl: string | undefined;
  lastName: string | null;
  publicMetadata: Record<string, unknown> & {
    role?: UserRole;
  };
  role: unknown;
  username: string | null;
};

export type PortalInvitation = {
  createdAt: number;
  email: string;
  id: string;
  status: string;
};

export type RecruitmentFormListItem = {
  id: number;
  header: string;
  description: string;
  link: string;
  expiresAt: Date;
};

export type OurWorkListItem = {
  description: string | null;
  id: number;
  imageUrl: string | null;
  monthName: string;
  monthNum: number;
  year: number;
};
