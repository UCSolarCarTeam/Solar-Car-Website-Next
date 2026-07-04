import { getCurrentDBUser } from "@/app/portal/actions";
import ProfileContent from "@/app/portal/_components/ProfileContent";

export const metadata = {
  title: "Profile - Portal",
};

export default async function ProfilePage() {
  const dbUser = await getCurrentDBUser();
  return <ProfileContent dbUser={dbUser} />;
}
