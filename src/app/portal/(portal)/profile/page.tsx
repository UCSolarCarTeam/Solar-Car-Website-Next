import { getCurrentDBUser } from "@/app/portal/_actions/queries";
import ProfileContent from "@/app/portal/_components/ProfileContent";

export const metadata = {
  title: "Profile - Portal",
};

export default async function ProfilePage() {
  const dbUser = await getCurrentDBUser();
  return <ProfileContent dbUser={dbUser} />;
}
