import ProfileContent from "@/app/portal/_components/ProfileContent";
import { getCurrentDBUser } from "@/app/portal/actions";

export const metadata = {
  title: "Profile - Portal",
};

export default async function ProfilePage() {
  const dbUser = await getCurrentDBUser();
  return <ProfileContent dbUser={dbUser} />;
}
