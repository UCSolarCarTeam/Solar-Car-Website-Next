import { currentUser } from "@clerk/nextjs/server";

export default async function UserProfile() {
  const user = await currentUser();
  if (!user) {
    return <div>User not found</div>;
  }
  const { fullName } = user;
  return <div>{fullName}</div>;
}
