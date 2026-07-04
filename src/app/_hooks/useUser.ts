import { type AdminRoles } from "@/server/portal/types";
import { useUser as useClerkUser } from "@clerk/nextjs";

export type ClerkUser =
  | (ReturnType<typeof useClerkUser>["user"] & {
      publicMetadata?: {
        role?: AdminRoles | ({} & string);
      };
    })
  | null;
export const useUser = () => {
  const userResponse = useClerkUser();
  return { ...userResponse, user: userResponse.user as ClerkUser | undefined };
};
