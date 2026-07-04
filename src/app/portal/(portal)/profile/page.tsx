import ProfileContent from "@/app/portal/_components/ProfileContent";
import { HydrateClient, trpc } from "@/trpc/server";

export const metadata = {
  title: "Profile - Portal",
};

export default async function ProfilePage() {
  const dbUser = await trpc.portal.getCurrentDBUser();

  return (
    <HydrateClient>
      <ProfileContent dbUser={dbUser} />
    </HydrateClient>
  );
}
